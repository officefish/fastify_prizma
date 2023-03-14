import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { CreateUserInput, LoginInput } from "./user.schema"
import { 
    CreateUserService, 
    FindUserByEmailService,
    FindUsersService,
    VerifyPasswordService,
 } from "./user.service"

async function register(
    request:FastifyRequest<{ Body: CreateUserInput }>, 
    reply:FastifyReply
) {
    const { body, server } = request
    try {
        const user = await CreateUserService(server.prisma, server.minCrypto, body)
        return reply.code(201).send(user)

    } catch (e) {
        return reply.code(500).send(e)
    }
}

async function login( 
    request:FastifyRequest<{ Body: LoginInput }>, 
    reply:FastifyReply
) {    
    const { body, server } = request
    const user = await FindUserByEmailService(server.prisma, body.email)
    if(!user) {
        return reply.code(404).send({ message: "User not found." })
    }
    const correctPassword = await VerifyPasswordService(
        server.minCrypto, {
        candidatePassword: body.password,
        salt: user.salt,
        hash: user.password
    })
    if(correctPassword) {
        const {password, salt, ...rest} = user

        const accessToken = request.server.jwt.sign(rest)
        return reply.code(200).send({ accessToken:accessToken })
    } 
        
    return reply.code(401).send({ message: "Incorrect password." })
}

async function getUsers(
    request:FastifyRequest, 
    reply:FastifyReply)
{
    const server = request.server
    const users = await FindUsersService(server.prisma)
    if (users) {
        return reply.code(200).send({ ...users})
    }
    return reply.code(401).send({ message: "No users found" })
}

export { 
    register as RegisterUserHandler,
    login as LoginUserHandler,
    getUsers as GetUsersHandler,
} 

