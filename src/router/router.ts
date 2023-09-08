import express from 'express';
import UserController from '../controller/UserCRUD';

const router = express.Router();

//user CRUDw
router.post('/UserSignUp', UserController.signUp);
router.post('/UserLogin', UserController.login);
router.put('/UserUpdate', UserController.detailUpdate);
router.post('/ForgotPassword', UserController.forgotPassword);
router.post('/reset-password/:token', UserController.resetPassword);

export default router;