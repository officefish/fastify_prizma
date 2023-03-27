import { PrismaClient, Prisma } from '@prisma/client'
import { MinCrypto } from '../../plugins'
//import { CreateUserInput, LoginInput } from './user.schema'

import { Role } from '@prisma/client'


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

async function updateUser(prisma:PrismaClient, data:Prisma.UserUpdateInput) {
    return await prisma.user.update({where: {
        email: data.email as string
    }, data})
}

async function findManyUsers(prisma:PrismaClient, data:Prisma.UserFindManyArgs) {
    return await prisma.user.findMany({...data})
}

async function updatePassword(prisma:PrismaClient, userId: string, newPassword: string) {

}

async function updatePasswordWithEmail(prisma:PrismaClient, email: string, newPassword: string) {

}

async function deleteUniqueUserById (prisma:PrismaClient, userId:string) {
    await prisma.user.delete({where:{id: userId}})
    await prisma.session.deleteMany({where: {userId}})
    await prisma.product.deleteMany({where: {ownerId: userId}}) 
}

async function deleteAllUsers(prisma:PrismaClient) {
    await prisma.session.deleteMany({})
    await prisma.product.deleteMany({}) 
    await prisma.user.deleteMany({})
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
    updateUser as UpdateUser,
    findManyUsers as FindManyUsers,
    updatePassword as UpdatePassword,
    updatePasswordWithEmail as UpdatePasswordWithEmail,
    verifyPassword as VerifyPassword,
    deleteUniqueUserById as DeleteUniqueUserById,
    deleteAllUsers as DeleteAllUsers
 }

 export default {
    GetUniqueUser: getUniqueUser,
    CreateUser: createUser,
    UpdateUser: updateUser,
    FindManyUsers: findManyUsers,
    VerifyPassword: verifyPassword,
    UpdatePassword: updatePassword,
    UpdatePasswordWithEmail: updatePasswordWithEmail, 
    GetUniqueUserPassword: getUniqueUserPassword,
    DeleteUniqueUserById: deleteUniqueUserById,
    DeleteAllUsers: deleteAllUsers
 }


