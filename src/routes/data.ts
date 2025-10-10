import { Router } from 'express';
import { authenticateAccessToken, AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';


const router = Router();


// Example: shared collection where each document may belong to a user or a client
const DataSchema = new mongoose.Schema({
    ownerType: { type: String, enum: ['user', 'client'], required: true },
    ownerId: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
});


const DataModel = mongoose.model('Data', DataSchema);


// Get all documents belonging to the authenticated principal (user or client)
router.get('/data', authenticateAccessToken, async (req: AuthRequest, res) => {
    try {
        if (req.tokenType === 'user') {
            const docs = await DataModel.find({ ownerType: 'user', ownerId: req.userId });
            return res.json({ ownerType: 'user', ownerId: req.userId, data: docs });
        }
        if (req.tokenType === 'client') {
            const docs = await DataModel.find({ ownerType: 'client', ownerId: req.clientId });
            return res.json({ ownerType: 'client', ownerId: req.clientId, data: docs });
        }
        return res.status(403).json({ error: 'Unknown token type' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});


// Create data scoped to the authenticated principal
router.post('/data', authenticateAccessToken, async (req: AuthRequest, res) => {
    try {
        const payload = req.body;
        if (req.tokenType === 'user') {
            const doc = new DataModel({ ownerType: 'user', ownerId: req.userId, payload });
            await doc.save();
            return res.status(201).json(doc);
        }
        if (req.tokenType === 'client') {
            const doc = new DataModel({ ownerType: 'client', ownerId: req.clientId, payload });
            await doc.save();
            return res.status(201).json(doc);
        }
        return res.status(403).json({ error: 'Unknown token type' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});


export default router;