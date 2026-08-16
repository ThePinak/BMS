// Task:
// 1. Create an Express router.
// 2. Add POST / for account creation.
// 3. Add GET / for fetching all accounts.
// 4. Add GET /:id for fetching single account.
// 5. Export the router.

import express from 'express';
import accountController from '../controllers/account.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public endpoints
router.post('/register', accountController.createAccountController);
router.post('/login', accountController.loginController);

// Protected endpoints
router.get('/', authMiddleware, accountController.getAllAccountsController);
router.get('/me', authMiddleware, accountController.getAccountByIdController);

router.post('/deposit', authMiddleware, accountController.depositController);
router.post('/withdraw', authMiddleware, accountController.withdrawController);
router.post('/transfer', authMiddleware, accountController.transferController);
router.get('/transactions', authMiddleware, accountController.getTransactionHistoryController);

export default router;