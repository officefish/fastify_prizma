import { PrismaClient, Prisma } from '@prisma/client'
import { MinCrypto } from '../../plugins'
//import { CreateUserInput, LoginInput } from './user.schema'

async function getUniqueUser(prisma:PrismaClient,  data:Prisma.UserWhereUniqueInput) {
    const user = await prisma.user.findUnique({where: data})
    return user
}

async function getUniqueUserPassword(prisma:PrismaClient,  data:Prisma.UserWhereUniqueInput) {
    const user = await prisma.user.findUnique({where: data})
    return user?.password
}

async function createUser(prisma:PrismaClient, data:Prisma.UserCreateInput) {
    const user = await prisma.user.create({data})
    return user
}

async function updatePassword(prisma:PrismaClient, userId: string, newPassword: string) {

}

async function updatePasswordWithEmail(prisma:PrismaClient, email: string, newPassword: string) {

}


type CandidatePasswordInput = {
    candidatePassword: string, salt: string, hash: string
}
async function verifyPassword(crypto:MinCrypto, input:CandidatePasswordInput) {
    return crypto.verifyPassword(input)
}
async function findUserByEmail(prisma: PrismaClient, email:string) {
    return await prisma.user.findUnique({where: {email}})
}
async function findUsers(prisma: PrismaClient) {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
        }
    })
}

export { 
    getUniqueUser as GetUniqueUser, 
    createUser as CreateUser, 
    updatePassword as UpdatePassword,
    updatePasswordWithEmail as UpdatePasswordWithEmail
 }

 export default {
    GetUniqueUser: getUniqueUser,
    CreateUser: createUser,
    UpdatePassword: updatePassword,
    UpdatePasswordWithEmail: updatePasswordWithEmail, 
    getUniqueUserPassword: getUniqueUserPassword
 }


export { 
    createUser as CreateUserService,
    findUserByEmail as FindUserByEmailService,
    verifyPassword as VerifyPasswordService,
    findUsers as FindUsersService 
}

