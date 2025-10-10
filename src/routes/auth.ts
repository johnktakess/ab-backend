import { Router } from 'express';
import * as authController from '../controllers/authController';


const router = Router();


// CLIENT endpoints (external apps)
router.post('/client/register', authController.registerClient); // public: create clientId+secret
router.post('/client/token', authController.clientToken); // exchange clientId+secret -> tokens


// USER endpoints (username/password)
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);


// Shared endpoints
router.post('/refresh', authController.refresh);
router.post('/introspect', authController.introspect);
router.post('/revoke/:type/:id', authController.revoke); // protected in prod


export default router;