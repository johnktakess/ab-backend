import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';


export interface AuthRequest extends Request {
    clientId?: string;
    userId?: string;
    tokenType?: 'user' | 'client';
}


export const authenticateAccessToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);


    jwt.verify(token, ACCESS_SECRET, (err, decoded: any) => {
        if (err) return res.sendStatus(403);
        const { sub, typ } = decoded;
        if (typ === 'client') {
            req.clientId = sub;
            req.tokenType = 'client';
        } else if (typ === 'user') {
            req.userId = sub;
            req.tokenType = 'user';
        }
        next();
    });
};