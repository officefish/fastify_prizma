import { PrismaClient } from '@prisma/client'
import { MinCrypto } from '../../plugins'
import { CreateUserInput, LoginInput } from './user.schema'

async function createUser(prisma: PrismaClient, crypto:MinCrypto, input:CreateUserInput) {
    const {password, ...rest} = input
    const { hash, salt }  = crypto.hashPassword(password)
    const user = await prisma.user.create({ 
        data: {...rest, salt, password: hash, verified:false} 
    })
    return user
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
    createUser as CreateUserService,
    findUserByEmail as FindUserByEmailService,
    verifyPassword as VerifyPasswordService,
    findUsers as FindUsersService 
}