// Task:
// 1. Import prisma client.
// 2. Create a function to create an account in the database.
// 3. Create a function to fetch all accounts.
// 4. Create a function to fetch a single account by id.
// 5. Export all repository functions.

import prisma from "../config/prisma.js";
    
const createAccountRepository = async (accountData) => {
    try {
        const account = await prisma.account.create({
            data: accountData
        });
        return account;
    } catch (error) {
        throw error;
    }
}

const getAllAccountsRepository = async () => {
    try {
        const accounts = await prisma.account.findMany();
        return accounts;
    } catch (error) {
        throw error;
    }
}

const getAccountByIdRepository = async (id) => {
    try {
        const account = await prisma.account.findUnique({
            where: {
                id: id
            }
        });
        return account;
    } catch (error) {
        throw error;
    }
}

const getAccountByEmailRepository = async(email)=>{
    try{
        const account = await prisma.account.findUnique({
            where:{
                email:email
            }
        });
        return account;
    }catch(error){
        throw error;
    }
}

// Task:
// 1. Add repository function to update account balance.
// 2. Add repository function to create a transaction entry.
// 3. Add repository function to get transactions by account id.
// 4. Export the new functions.

// New functions to add:
// updateAccountBalanceRepository(id, balance)
// createTransactionRepository(data)
// getTransactionsByAccountIdRepository(accountId)
// Transaction data should include:
// accountId
// type
// amount

const updateAccountBalanceRepository = async (id, balance) => {
    try {
        const account = await prisma.account.update({
            where: {
                id: id
            },
            data: {
                balance: balance
            }
        });
        return account;
    } catch (error) {
        throw error;
    }
}

const createTransactionRepository = async (data) => {
    try {
        const transaction = await prisma.transaction.create({
            data: data
        });
        return transaction;
    } catch (error) {
        throw error;
    }
}

const getTransactionsByAccountIdRepository = async (accountId) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                accountId: accountId
            }
        });
        return transactions;
    } catch (error) {
        throw error;
    }
}

const executeDepositTransactionRepository = async (accountId, newBalance, amount) => {
    try {
        const results = await prisma.$transaction([
            prisma.account.update({ where: { id: accountId }, data: { balance: newBalance } }),
            prisma.transaction.create({ data: { accountId, type: "DEPOSIT", amount } })
        ]);
        return results[0];
    } catch (error) {
        throw error;
    }
}

const executeWithdrawTransactionRepository = async (accountId, newBalance, amount) => {
    try {
        const results = await prisma.$transaction([
            prisma.account.update({ where: { id: accountId }, data: { balance: newBalance } }),
            prisma.transaction.create({ data: { accountId, type: "WITHDRAW", amount } })
        ]);
        return results[0];
    } catch (error) {
        throw error;
    }
}

const executeTransferTransactionRepository = async (fromAccountId, toAccountId, newFromBalance, newToBalance, amount) => {
    try {
        const results = await prisma.$transaction([
            prisma.account.update({ where: { id: fromAccountId }, data: { balance: newFromBalance } }),
            prisma.account.update({ where: { id: toAccountId }, data: { balance: newToBalance } }),
            prisma.transaction.create({ data: { accountId: fromAccountId, type: "TRANSFER_SENT", amount } }),
            prisma.transaction.create({ data: { accountId: toAccountId, type: "TRANSFER_RECEIVED", amount } })
        ]);
        return {
            fromAccount: results[0],
            toAccount: results[1]
        };
    } catch (error) {
        throw error;
    }
}

export default {
    createAccountRepository,
    getAllAccountsRepository,
    getAccountByIdRepository,
    getAccountByEmailRepository,
    updateAccountBalanceRepository,
    createTransactionRepository,
    getTransactionsByAccountIdRepository,
    executeDepositTransactionRepository,
    executeWithdrawTransactionRepository,
    executeTransferTransactionRepository
}
