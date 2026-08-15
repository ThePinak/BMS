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

export default {
    createAccountRepository,
    getAllAccountsRepository,
    getAccountByIdRepository,
    getAccountByEmailRepository
}
