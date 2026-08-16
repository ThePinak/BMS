// Task:
// 1. Import account repository functions.
// 2. Create service for account creation.
// 3. Prevent duplicate email accounts.
// 4. Create service to get all accounts.
// 5. Create service to get single account by id.
// 6. Throw meaningful errors when account is missing or email already exists.

// Task:
// 1. Import AppError.
// 2. Replace plain Error usage with AppError.
// 3. Use proper status codes for business errors.
// 4. Keep service logic same, only improve error handling.
import accountRepository from "../repositories/account.repositories.js";
import AppError from "../utils/appError.js";

const createAccountService = async(name,email,balance)=>{
    try{
        const existingAccount = await accountRepository.getAccountByEmailRepository(email);
        if(existingAccount){
            throw new AppError("Account with this email already exists", 409);
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
            throw new AppError("Account not found", 404);
        }
        else{
            return account;
        }
    }
    catch(error){
        throw error;
    }
}

// Task:
// 1. Add deposit service.
// 2. Add withdraw service.
// 3. Prevent insufficient balance on withdrawal.
// 4. Add transfer service.
// 5. Prevent transfer to same account.
// 6. Prevent insufficient balance on transfer.
// 7. Record transaction entries in database.
// 8. Add service to fetch transaction history.

// Business logic:
// Deposit
// account must exist
// add amount to balance
// save updated balance
// create transaction with type "DEPOSIT"
// Withdraw
// account must exist
// amount must not exceed current balance
// subtract amount
// save updated balance
// create transaction with type "WITHDRAW"
// Transfer
// source account must exist
// destination account must exist
// source and destination must be different
// source must have enough balance
// deduct from source
// add to destination
// create two transactions:"TRANSFER_SENT"
// "TRANSFER_RECEIVED"

// Transaction history
// account must exist
// fetch all transactions for that account

const depositService = async (accountId, amount) => {
    try {
        const account = await accountRepository.getAccountByIdRepository(accountId);
        if (!account) {
            throw new AppError("Account not found", 404);
        }
        else {
            const updatedAccount = await accountRepository.executeDepositTransactionRepository(
                accountId, 
                Number(account.balance) + amount, 
                amount
            );
            return updatedAccount;
        }
    }
    catch (error) {
        throw error;
    }
}

const withdrawService = async (accountId, amount) => {
    try {
        const account = await accountRepository.getAccountByIdRepository(accountId);
        if (!account) {
            throw new AppError("Account not found", 404);
        }
        else if (Number(account.balance) < amount) {
            throw new AppError("Insufficient balance", 400);
        }
        else {
            const updatedAccount = await accountRepository.executeWithdrawTransactionRepository(
                accountId, 
                Number(account.balance) - amount, 
                amount
            );
            return updatedAccount;
        }
    }
    catch (error) {
        throw error;
    }
}

const transferService = async (fromAccountId, toAccountId, amount) => {
    try {
        const fromAccount = await accountRepository.getAccountByIdRepository(fromAccountId);
        const toAccount = await accountRepository.getAccountByIdRepository(toAccountId);
        if (!fromAccount || !toAccount) {
            throw new AppError("Account not found", 404);
        }
        else if (fromAccount.id === toAccount.id) {
            throw new AppError("Source and destination account must be different", 400);
        }
        else if (Number(fromAccount.balance) < amount) {
            throw new AppError("Insufficient balance", 400);
        }
        else {
            const result = await accountRepository.executeTransferTransactionRepository(
                fromAccountId, 
                toAccountId, 
                Number(fromAccount.balance) - amount, 
                Number(toAccount.balance) + amount, 
                amount
            );
            return result;
        }
    }
    catch (error) {
        throw error;
    }
}

const getTransactionHistoryService = async (accountId) => {
    try {
        const account = await accountRepository.getAccountByIdRepository(accountId);
        if (!account) {
            throw new AppError("Account not found", 404);
        }
        else {
            const transactions = await accountRepository.getTransactionsByAccountIdRepository(accountId);
            return transactions;
        }
    }
    catch (error) {
        throw error;
    }
}

export default {
    createAccountService,
    getAllAccountsService,
    getAccountByIdService,
    depositService,
    withdrawService,
    transferService,
    getTransactionHistoryService
}




