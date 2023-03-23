import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { 
    CreateUserInput,
    ChangePasswordInput,
    UniqueUserInput,
} from "./user.schema"

import userService from "./user.service"
import service from '../../services'
import { authController } from "../authorization/auth.controller"
import { UserPayload } from "../../plugins/auth/jwt-plugin"

// async function register(
//     request:FastifyRequest<{ Body: CreateUserInput }>, 
//     reply:FastifyReply
// ) {
//     const { body, server } = request
//     try {
//         const user = await CreateUserService(server.prisma, server.minCrypto, body)
//         return reply.code(201).send(user)

//     } catch (e) {
//         return reply.code(500).send(e)
//     }
// }

// async function login( 
//     request:FastifyRequest<{ Body: LoginInput }>, 
//     reply:FastifyReply
// ) {    
//     const { body, server } = request
//     const user = await FindUserByEmailService(server.prisma, body.email)
//     if(!user) {
//         return reply.code(404).send({ message: "User not found." })
//     }
//     const correctPassword = await VerifyPasswordService(
//         server.minCrypto, {
//         candidatePassword: body.password,
//         salt: user.salt,
//         hash: user.password
//     })
//     if(correctPassword) {
//         const {password, salt, ...rest} = user

//         const accessToken = request.server.jwt.sign(rest)
//         return reply.code(200).send({ accessToken:accessToken })
//     } 
        
//     return reply.code(401).send({ message: "Incorrect password." })
// }

// async function getUsers(
//     request:FastifyRequest, 
//     reply:FastifyReply)
// {
//     const server = request.server
//     const users = await FindUsersService(server.prisma)
//     if (users) {
//         return reply.code(200).send({ ...users})
//     }
//     return reply.code(401).send({ message: "No users found" })
// }

async function getUniqueUser(request:FastifyRequest<{
    Body:UniqueUserInput
}>, reply:FastifyReply) {
    const {email, id} = request.body
    const prisma = request.server.prisma
    const user = await userService.GetUniqueUser(prisma, {email, id})
    return user
}

async function getCurrentUser(request:FastifyRequest, reply:FastifyReply) {
    const id = (request.user as UserPayload).id
    const prisma = request.server.prisma
    const user = await userService.GetUniqueUser(prisma, {id})
    return user
}

async function createUser(request:FastifyRequest<{
    Body: CreateUserInput
  }>, reply:FastifyReply) {
    const {email, password} = request.body
    const saltLength = request.server.env.JWT_SALT_LENGTH
    const bcrypt = request.server.bcrypt
    const prisma = request.server.prisma
  
    try {
      const salt = await service.GenerateSalt(bcrypt, saltLength)
      const hashedPassword = await service.Hash(bcrypt, password, salt)
  
      // Insert a record into the "user" collection.
      const data = { email, password:hashedPassword, salt, verified: false }
      await userService.CreateUser(prisma, data)
  
      // After successfully creating a new user, automatically log in.
      await authController.login(request, reply)
  
      // Send email to user containing a link
      // they can click to verify their account.
      // Some operations could require the user to be verified.
      //await sendVerifyEmail(request, email)

      //console.log(reply.cookies)


    } catch (e) {
      console.error('createUser error:', e)
      reply.code(500).send(e)
    }
}


async function forgotPassword(request:FastifyRequest, reply:FastifyReply) {

}

async function changePassword(request:FastifyRequest<{
        Body: ChangePasswordInput
    }>, reply:FastifyReply) {
    
    const {email, oldPassword, newPassword} = request.body

    const unencodedEmail = decodeURIComponent(email)
    const bcrypt = request.server.bcrypt
    const prisma = request.server.prisma

    const saltLength = request.server.env.JWT_SALT_LENGTH
  
    try {
      // This verifies that the user is currently authenticated
      // and gets their current hashed password.
        const user = request.user as UserPayload//await getUser(request, reply)
        const password = await userService.GetUniqueUserPassword(prisma, {id: user.id})
        const matches = await service.Compare(bcrypt, oldPassword, password || '')
        
        if (matches) {
            const salt = await service.GenerateSalt(bcrypt, saltLength)
            const hashedPassword = await service.Hash(bcrypt, newPassword, salt)
            await userService.UpdatePasswordWithEmail(prisma, unencodedEmail, hashedPassword)
            reply.send('changed password')      
        } else {
            reply.code(400).send('invalid email or password');
        }
    } catch (e) {
      console.error('changePassword error:', e)
      reply.code(500).send('error changing password: ' + e)
    }

}



async function deleteCurrentUser(request:FastifyRequest, reply:FastifyReply) {

}

async function deleteUser(request:FastifyRequest, reply:FastifyReply) {

}

async function deleteUserSessions(request:FastifyRequest, reply:FastifyReply) {

}

async function getNewPassword(request:FastifyRequest, reply:FastifyReply) { 

}

async function resetPassword(request:FastifyRequest, reply:FastifyReply) {

}

export { 
    getCurrentUser as GetCurrentUserHandler,
    getUniqueUser as GetUniqueUserHandler,
    forgotPassword as ForgotPasswordHandler,
    changePassword as ChangePasswordHandler,
    createUser as CreateUserHandler,
    deleteCurrentUser as DeleteCurrentUserHandler,
    deleteUser as DeleteUserHandler,
    deleteUserSessions as DeleteUserSessionsHandler,
    getNewPassword as GetNewPasswordHandler,
    resetPassword as ResetPasswordHandler,
} 

