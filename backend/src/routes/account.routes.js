// Task:
// 1. Create an Express router.
// 2. Add POST / for account creation.
// 3. Add GET / for fetching all accounts.
// 4. Add GET /:id for fetching single account.
// 5. Export the router.

import express from 'express';
import accountController from '../controllers/account.controllers.js';

const router = express.Router();

router.post('/',accountController.createAccountController);
router.get('/',accountController.getAllAccountsController);
router.get('/:id',accountController.getAccountByIdController);

export default router;