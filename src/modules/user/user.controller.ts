import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { 
    CreateUserInput,
    UniqueUserInput,
    ManyUsersInput,
    ChangePasswordInput,
    ForgotPasswordInput,
    NewPasswordInput,
    ResetPasswordInput,
    UpdateRoleInput
} from "./user.schema"

import userService from "./user.service"
import service from '../../services'
import { authController } from "../authorization/auth.controller"
import { UserPayload } from "../../plugins/auth/jwt-plugin"

import { Role } from "@prisma/client"

async function getManyUsers(
  request:FastifyRequest<{
  Params: ManyUsersInput
  }>, 
  reply:FastifyReply) 
{
  const {skip, take} = request.params
  const server = request.server
  const users = userService.FindManyUsers(server.prisma, {skip, take})
  if (users) {
    return reply.code(200).send({ ...users})
  }
  return reply.code(401).send({ error: { message: "No users found" }})
}

async function getUniqueUser(request:FastifyRequest<{
    Body:UniqueUserInput
}>, reply:FastifyReply) {
    const {email, id} = request.body
    const prisma = request.server.prisma
    try {
      const user = await userService.GetUniqueUser(prisma, {email, id})
      return user
    } catch(e) {
      reply.code(400).send({error:e})
    }
  
}

async function getCurrentUser(request:FastifyRequest, reply:FastifyReply) {
    const id = (request.user as UserPayload).id
    const prisma = request.server.prisma
    try {
      const user = await userService.GetUniqueUser(prisma, {id})
      return user
    } catch(e) {
      reply.code(400).send({error:e})      
    }
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
  
    } catch (e) {
      console.error('createUser error:', e)
      reply.code(500).send(e)
    }
}


async function forgotPassword(request:FastifyRequest<{
  Params:ForgotPasswordInput
}>, reply:FastifyReply) {
  const {email} = request.params
  const jwt = request.server.jwt
  try {
    // Get the record from the "user" collection with the specified email.
    const prisma = request.server.prisma
    const user = await userService.GetUniqueUser(prisma, {email})
    if (user) {
      // Create a password reset link to be included in an email message.
      // The "/user/reset" REST service called from password-reset.js
      // verifies that the "email" and "expires" values
      // passed as query parameters match those found in the JWT.
      // So it is not possible to use an expired link
      // by simply changing the "expires" query parameter.
      const minutes = request.server.env.LINK_EXPIRE_MINUTES
      const expires = service.NowPlusMinutes(minutes)
      const token = await service.Sign(jwt, {email, expires })
      const secure = false
      const domain = 'localhost'
      
      const link = service.GetResetPasswordLink({secure, domain, email, token, expires})
      // Send an email containing a link that can be clicked
      // to reset the password of the associated user.
      const mailer = request.server.nodemailer
      const from = request.server.env.FROM_EMAIL
      const subject = 'Reset your password'
      const html =
          'Click the link below to reset your password.<br><br>' +
          `<a href="${link}">RESET PASSWORD</a>`
        await service.SendMail(mailer, {from, to: email, subject, html})
  }
  // Return a success status even if user doesn't exist
  // so bots cannot use this service to determine
  // whether a user with a specified email exists.
    reply.send({status:'ok'})
  } catch (e) {
    console.error('forgotPassword error:', e)
    reply.code(400).send('error sending password reset email')
  }
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
            reply.code(400).send('invalid email or password')
        }
    } catch (e) {
      console.error('changePassword error:', e)
      reply.code(500).send('error changing password: ' + e)
    }

}

async function deleteCurrentUser(request:FastifyRequest, reply:FastifyReply) {
  const prisma = request.server.prisma
  try {
      // This verifies that the user is currently authenticated
      // and gets their email.
      const user = await getCurrentUser(request, reply)
      if (user) {
        const userId = user.id
        await userService.DeleteUniqueUserById(prisma, userId)
        await authController.logout(request, reply)

      } else {
        reply.code(400).send({error: { message:'Error deleting user. User not found.'}})
      }
    } catch (e) {
        reply.code(400).send({error:e})
    }
}

async function deleteUser(request:FastifyRequest<{
  Params:UniqueUserInput
}>, reply:FastifyReply) {
  const prisma = request.server.prisma
  const {email, id} = request.params
  
  try {  
    const user = await userService.GetUniqueUser(prisma, {email, id})
    if (user) {
      const userId = user.id
      await userService.DeleteUniqueUserById(prisma, userId)

      //TODO: We should also destroy user session. 
      // But it would be possible only with redis rerver.
      // Current request.sessionStore does not support deleteMany or filter functions
    } else {
      reply.code(400).send({error: { message:'Error deleting user. User not found.'}})
    }
  } catch (e) {
      reply.code(400).send({error:e})
  }

 
}

async function deleteUserSessions(request:FastifyRequest, reply:FastifyReply) {

}

async function getNewPassword(request:FastifyRequest<{
  Params:NewPasswordInput
}>, reply:FastifyReply) { 
  const {email, expires, token} = request.params
  // Redirect the browser to the "Password Reset" page,
  // including query parameters that are needed
  // to validate a password reset request.
  const secure = false
  const domain = 'localhost'
  const link = service.GetResetPasswordLink({secure, domain, email, token, expires:new Date(expires)})
  reply.redirect(link)
}

async function resetPassword(request:FastifyRequest<{
  Body: ResetPasswordInput
}>, reply:FastifyReply) {
  const {email, expires, password, token} = request.body
  // Determine if the token matches the
  // specified email and expires timestamp.
  const crypto = request.server.minCrypto
  const signature = request.server.env.JWT_SIGNATURE
  
  const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')
  const matches = token === emailToken
  // If the token does not match or is expired ...
  if (!matches || Date.now() > +expires) {
    reply.code(400).send({error: {message:'password reset link expired'}})
    return
  }
  
  try {
    // Update the record in the "user" collection
    // with a new hashed password.
    const saltLength = request.server.env.JWT_SALT_LENGTH
    const bcrypt = request.server.bcrypt
    const prisma = request.server.prisma
    const salt = await service.GenerateSalt(bcrypt, saltLength)
    const hashedPassword = await service.Hash(bcrypt, password, salt)

    await userService.UpdateUser(prisma, {email, password:hashedPassword})
    reply.code(200).send({status:'ok', message:'password reset'})
  
  } catch (e) {
    reply.code(400).send(e)
  }
}

async function isAdmin (request:FastifyRequest, reply:FastifyReply) {
  const status = request.session.userRole  === Role.ADMIN
  if (!status) {
    reply.code(400).send("'ADMIN' role required.")
  }
} 

async function isPublisher(request:FastifyRequest, reply:FastifyReply) {
  const status = (request.session.userRole  === Role.ADMIN) 
    || (request.session.userRole  === Role.PUBLISHER) 
  if (!status) {
    reply.code(400).send("'PUBLISHER' role required.")
  }
}

async function isDeveloper(request:FastifyRequest, reply:FastifyReply) {
  const status = (request.session.userRole  === Role.ADMIN) 
    || (request.session.userRole  === Role.DEVELOPER) 
  if (!status) {
    reply.code(400).send("'DEVELOPER' role required.")
  }
}

async function isMember(request:FastifyRequest, reply:FastifyReply) {
  const status = (request.session.userRole  !== Role.GUEST) 
  if (!status) {
    reply.code(400).send("'MEMBER' role required.")
  }
}

async function updateRole(request:FastifyRequest<{
  Body:UpdateRoleInput
}>, reply:FastifyReply) {
  const {role, email} = request.body
  const prisma = request.server.prisma
  try {
    const user = await userService.UpdateUser(prisma, {role, email})
    reply.code(200).send({status:'ok', message:`User has new role: ${user.role}`})

  } catch(e) {
    reply.code(400).send({error:e, message:'User role is not updated.'})
  }
}

export { 
    
    getCurrentUser as GetCurrentUserHandler,
    getUniqueUser as GetUniqueUserHandler,
    getManyUsers as GetManyUsersHandler,
    forgotPassword as ForgotPasswordHandler,
    changePassword as ChangePasswordHandler,
    createUser as CreateUserHandler,
    deleteCurrentUser as DeleteCurrentUserHandler,
    deleteUser as DeleteUserHandler,
    deleteUserSessions as DeleteUserSessionsHandler,
    getNewPassword as GetNewPasswordHandler,
    resetPassword as ResetPasswordHandler,
    isAdmin as IsAdminHandler,
    isPublisher as IsPablisherHandler,
    isDeveloper as IsDeveloperHandler,
    isMember as IsMemberHandler,
    updateRole as UpdateRoleHandler

} 

