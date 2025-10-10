import { Request, Response } from 'express';
import Client from '../models/Client';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const ACCESS_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRES = (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as jwt.SignOptions["expiresIn"];

export function signAccessToken(payload: JwtPayload | string) {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function signRefreshToken(payload: JwtPayload | string) {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES };
  return jwt.sign(payload, REFRESH_SECRET, options);
}

// ------------------ CLIENT: register (self-service external apps)
export const registerClient = async (req: Request, res: Response) => {
    try {
        const { clientName } = req.body;
        const clientId = uuidv4();
        const clientSecret = uuidv4(); // shown once

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(clientSecret, salt);

        const client = new Client({ clientId, clientSecretHash: hash, clientName });
        await client.save();

        return res.status(201).json({ clientId, clientSecret });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ------------------ CLIENT: token (exchange clientId + clientSecret)
export const clientToken = async (req: Request, res: Response) => {
    try {
        const { clientId, clientSecret } = req.body;
        if (!clientId || !clientSecret) return res.status(400).json({ error: 'clientId and clientSecret required' });

        const client = await Client.findOne({ clientId });
        if (!client) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(clientSecret, client.clientSecretHash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const jti = uuidv4();
        const accessToken = signAccessToken({ sub: clientId, typ: 'client' });
        const refreshToken = jwt.sign({ sub: clientId, typ: 'client', jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

        client.refreshTokens.push(jti);
        await client.save();

        return res.json({ accessToken, refreshToken, tokenType: 'Bearer', expiresIn: ACCESS_EXPIRES });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ------------------ USER: register (username/password)
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { customerId, firstName, lastName, username, password, email } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Email and password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email already taken' });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User({ customerId, firstName, lastName, username, passwordHash: hash, email });
        await user.save();

        return res.status(201).json({ message: 'User registered' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ------------------ USER: login (username + password -> tokens)
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const jti = uuidv4();
        const accessToken = signAccessToken({ sub: user._id.toString(), typ: 'user' });
        const refreshToken = jwt.sign({ sub: user._id.toString(), typ: 'user', jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

        user.refreshTokens.push(jti);

        // limit active tokens (e.g., 5 max)
        if (user.refreshTokens.length > 5) {
            user.refreshTokens.shift(); // remove oldest
        }
        await user.save();

        return res.json({ accessToken, refreshToken, tokenType: 'Bearer', expiresIn: ACCESS_EXPIRES });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ------------------ REFRESH: same endpoint can accept either user or client refresh token
export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

        jwt.verify(refreshToken, REFRESH_SECRET, async (err:any, decoded: any) => {
            if (err) return res.status(403).json({ error: 'Invalid refresh token' });

            const { sub, typ, jti } = decoded;

            if (typ === 'client') {
                const client = await Client.findOne({ clientId: sub });
                if (!client) return res.status(403).json({ error: 'Invalid refresh token' });
                if (!client.refreshTokens.includes(jti)) return res.status(403).json({ error: 'Refresh token revoked' });

                // issue new access token (you may rotate refresh tokens here)
                const accessToken = signAccessToken({ sub, typ: 'client' });
                return res.json({ accessToken, tokenType: 'Bearer', expiresIn: ACCESS_EXPIRES });
            }

            if (typ === 'user') {
                const user = await User.findById(sub);
                if (!user) return res.status(403).json({ error: 'Invalid refresh token' });
                if (!user.refreshTokens.includes(jti)) return res.status(403).json({ error: 'Refresh token revoked' });

                // remove old token (rotation + cleanup)
                user.refreshTokens = user.refreshTokens.filter((t:any) => t !== refreshToken);

                const accessToken = signAccessToken({ sub, typ: 'user' });
                return res.json({ accessToken, tokenType: 'Bearer', expiresIn: ACCESS_EXPIRES });
            }

            return res.status(400).json({ error: 'Invalid token type' });
        });
    } catch (err) {
    console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ------------------ REVOKE: revoke refresh tokens for client or user
export const revoke = async (req: Request, res: Response) => {
    try {
        const { type, id } = req.params; // type = 'client' or 'user', id = clientId or userId

        if (type === 'client') {
            const client = await Client.findOne({ clientId: id });
            if (!client) return res.status(404).json({ error: 'Client not found' });
            client.refreshTokens = [];
            await client.save();
            return res.json({ message: 'Client refresh tokens revoked' });
        }

        if (type === 'user') {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            user.refreshTokens = [];
            await user.save();
            return res.json({ message: 'User refresh tokens revoked' });
        }

        return res.status(400).json({ error: 'Invalid type' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ------------------ INTROSPECT (verify access token and return metadata)
export const introspect = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });

    jwt.verify(token, ACCESS_SECRET, (err:any, decoded:any) => {
        if (err) return res.status(200).json({ active: false });
        return res.status(200).json({ active: true, decoded });
    });
};