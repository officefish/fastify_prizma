import { PrismaClient } from '@prisma/client'
import { MinCrypto } from '../../plugins'
import { CreateUserInput } from './user.schema'

async function createUser(prisma: PrismaClient, crypto:MinCrypto, input:CreateUserInput) {
    
    const {password, ...rest} = input
    const { hash, salt }  = crypto.hashPassword(password)

    const user = await prisma.user.create({ 
        data: {...rest, salt, password: hash} 
    })
    return user
}

export { createUser as CreateUserService }