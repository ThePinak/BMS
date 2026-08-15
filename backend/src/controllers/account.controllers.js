// Task:
// 1. Import account service functions.
// 2. Import account validator.
// 3. Validate request body before creating account.
// 4. Handle create account request.
// 5. Handle get all accounts request.
// 6. Handle get single account request.
// 7. Return proper HTTP status codes and JSON responses.

import accountService from "../services/account.services.js";
import accountValidator from "../validators/account.validator.js";

const createAccountController = async(req,res)=>{
    try{
        const validationResult = accountValidator.safeParse(req.body);
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
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const getAllAccountsController = async(req,res)=>{
    try{
        const accounts = await accountService.getAllAccountsService();
        return res.status(200).json({
            success:true,
            message:"Accounts fetched successfully",
            data:accounts
        });
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const getAccountByIdController = async(req,res)=>{
    try{
        const validationResult = accountValidator.safeParse(req.params);
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
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

export default {
    createAccountController,
    getAllAccountsController,
    getAccountByIdController
}