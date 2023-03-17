import { PrismaClient } from "@prisma/client"

async function getUser(prisma:PrismaClient, userId: string) {
   
}

async function updatePassword(prisma:PrismaClient, userId: string, newPassword: string) {

}

async function updatePasswordWithEmail(prisma:PrismaClient, email: string, newPassword: string) {

}

export { 
    getUser as GetUser, 
    updatePassword as UpdatePassword,
    updatePasswordWithEmail as UpdatePasswordWithEmail
 }
