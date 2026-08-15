// Task:
// 1. Import account repository functions.
// 2. Create service for account creation.
// 3. Prevent duplicate email accounts.
// 4. Create service to get all accounts.
// 5. Create service to get single account by id.
// 6. Throw meaningful errors when account is missing or email already exists.

import accountRepository from "../repositories/account.repositories.js";

const createAccountService = async(name,email,balance)=>{
    try{
        const existingAccount = await accountRepository.getAccountByEmailRepository(email);
        if(existingAccount){
            throw new Error("Account with this email already exists");
        }
        else{
            const account = await accountRepository.createAccountRepository({
                name:name,
                email:email,
                balance:balance
            });
            return account;
        }
    }
    catch(error){
        throw error;
    }
}

const getAllAccountsService = async()=>{
    try{
        const accounts = await accountRepository.getAllAccountsRepository();
        return accounts;
    }
    catch(error){
        throw error;
    }
}

const getAccountByIdService = async(id)=>{
    try{
        const account = await accountRepository.getAccountByIdRepository(id);
        if(!account){
            throw new Error("Account not found");
        }
        else{
            return account;
        }
    }
    catch(error){
        throw error;
    }
}   

export default {
    createAccountService,
    getAllAccountsService,
    getAccountByIdService
}




