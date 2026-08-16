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
import { createAccountSchema, loginSchema } from "../validators/account.validator.js";
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
        const { name, email, password, balance } = validationResult.data;
        const account = await accountService.createAccountService(name, email, password, balance);
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

const loginController = async (req, res, next) => {
    try {
        const validationResult = loginSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                success:false,
                message:validationResult.error.issues[0].message
            });
        }
        const { email, password } = validationResult.data;
        const result = await accountService.loginService(email, password);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
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
        // Using req.user.id for security instead of params
        const account = await accountService.getAccountByIdService(req.user.id);
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

// Controller for depositing money
const depositController = async (req, res, next) => {
    try {
        const validationResult = amountSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues[0].message
            });
        }
        const { amount } = validationResult.data;
        const account = await accountService.depositService(req.user.id, amount);
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
        const validationResult = amountSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues[0].message
            });
        }
        const { amount } = validationResult.data;
        const account = await accountService.withdrawService(req.user.id, amount);
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
        const { toAccountId, amount } = validationResult.data;
        const accounts = await accountService.transferService(req.user.id, toAccountId, amount);
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
        const transactions = await accountService.getTransactionHistoryService(req.user.id);
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
    loginController,
    getAllAccountsController,
    getAccountByIdController,
    depositController,
    withdrawController,
    transferController,
    getTransactionHistoryController
}