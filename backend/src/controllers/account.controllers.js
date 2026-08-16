// Task:
// 1. Import account service functions.
// 2. Import account validator.
// 3. Validate request body before creating account.
// 4. Handle create account request.
// 5. Handle get all accounts request.
// 6. Handle get single account request.
// 7. Return proper HTTP status codes and JSON responses.

// Task:
// 1. Keep request validation in controllers.
// 2. On validation failure, return 400 directly.
// 3. For service errors, pass error to next(error).
// 4. Remove repeated manual error response handling where middleware can handle it.

import accountService from "../services/account.services.js";
import { createAccountSchema, accountIdParamSchema } from "../validators/account.validator.js";
import { amountSchema, transferSchema } from "../validators/transaction.validator.js";

const createAccountController = async(req, res, next)=>{
    try{
        const validationResult = createAccountSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                success:false,
                message:validationResult.error.issues[0].message
            });
        }
        const { name, email, balance } = validationResult.data;
        const account = await accountService.createAccountService(name, email, balance);
        return res.status(201).json({
            success:true,
            message:"Account created successfully",
            data:account
        });
    }
    catch(error){
        next(error);
    }
}

const getAllAccountsController = async(req, res, next)=>{
    try{
        const accounts = await accountService.getAllAccountsService();
        return res.status(200).json({
            success:true,
            message:"Accounts fetched successfully",
            data:accounts
        });
    }
    catch(error){
        next(error);
    }
}

const getAccountByIdController = async(req, res, next)=>{
    try{
        const validationResult = accountIdParamSchema.safeParse(req.params);
        if(!validationResult.success){
            return res.status(400).json({
                success:false,
                message:validationResult.error.issues[0].message
            });
        }
        const account = await accountService.getAccountByIdService(validationResult.data.id);
        return res.status(200).json({
            success:true,
            message:"Account fetched successfully",
            data:account
        });
    }
    catch(error){
        next(error);
    }
}

// Task:
// 1. Import transaction validators.
// 2. Add deposit controller.
// 3. Add withdraw controller.
// 4. Add transfer controller.
// 5. Add transaction history controller.
// 6. Return proper JSON responses and status codes.

// Controller for depositing money
const depositController = async (req, res, next) => {
    try {
        const paramValidation = accountIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({ success: false, message: paramValidation.error.issues[0].message });
        }
        const validationResult = amountSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues[0].message
            });
        }
        const { amount } = validationResult.data;
        const account = await accountService.depositService(req.params.id, amount);
        return res.status(200).json({
            success: true,
            message: "Deposit successful",
            data: account
        });
    }
    catch (error) {
        next(error);
    }
}

// Controller for withdrawing money
const withdrawController = async (req, res, next) => {
    try {
        const paramValidation = accountIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({ success: false, message: paramValidation.error.issues[0].message });
        }
        const validationResult = amountSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues[0].message
            });
        }
        const { amount } = validationResult.data;
        const account = await accountService.withdrawService(req.params.id, amount);
        return res.status(200).json({
            success: true,
            message: "Withdrawal successful",
            data: account
        });
    }
    catch (error) {
        next(error);
    }
}

// Controller for transferring money
const transferController = async (req, res, next) => {
    try {
        const validationResult = transferSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues[0].message
            });
        }
        const { fromAccountId, toAccountId, amount } = validationResult.data;
        const accounts = await accountService.transferService(fromAccountId, toAccountId, amount);
        return res.status(200).json({
            success: true,
            message: "Transfer successful",
            data: accounts
        });
    }
    catch (error) {
        next(error);
    }
}

// Controller for getting transaction history
const getTransactionHistoryController = async (req, res, next) => {
    try {
        const paramValidation = accountIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({ success: false, message: paramValidation.error.issues[0].message });
        }
        const transactions = await accountService.getTransactionHistoryService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Transaction history fetched successfully",
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
}

export default {
    createAccountController,
    getAllAccountsController,
    getAccountByIdController,
    depositController,
    withdrawController,
    transferController,
    getTransactionHistoryController
}