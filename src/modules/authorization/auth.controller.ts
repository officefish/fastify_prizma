
import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"

import { 
  CreateUserInput, 
  ChangePasswordInput } from "./auth.schema"

import service from "./service"

// Load environment variables from the .env file into process.env.
// JWT_SIGNATURE is a hard-to-guess string.

import { UnivocalJwt, UserPayload, JwtExpPayload } from "../../plugins/auth/jwt-plugin"


async function getProtectedData(request:FastifyRequest, reply:FastifyReply) {
    // try {
    //     // There are built-in ways in Fastify
    //     // to verify that the user is authenticated,
    //     // but we are doing it manually to demonstrate the steps.
    //     await getUser(request, reply);
    //     reply.send({data: 'This is protected data.'});
    //   } catch (e) {
    //     console.error('server.js getProtectedData:', e.message);
    //     reply.code(401).send();
    //   }
}

async function getUnprotectedData(request:FastifyRequest, reply:FastifyReply) {
    reply.send({data: 'This is unprotected data.'})
}

async function getUser(request:FastifyRequest, reply:FastifyReply) {

    const jwt = request.server.jwt
    const prisma = request.server.prisma

    const accessToken = request.cookies['access-token'] as string
    console.log('accessToken:', accessToken)
    //const jwtPayload = jwt.decode(
    //  req.header('authorization')!
    //) as JwtExpPayload

    if (accessToken) {
      const decodedPayload = await jwt.verify(accessToken) as UserPayload
      console.log('decodedPayload: ', decodedPayload)
      const user = await service.GetUser(prisma, decodedPayload.id)
      return user
    } else {
      const refreshToken = request.cookies['refresh-token']
      if (refreshToken) {
        // This throws if refreshToken is not valid.
        const decodedRefreshToken = jwt.verify(refreshToken) as UserPayload
        
        //const session = await getCollection('session').findOne({sessionToken})
        const session = await service.GetSession(prisma, decodedRefreshToken.id)
  
        if (session && session.valid) {
          const user = await service.GetUser(prisma, session.ownerId)
          if (!user) throw new Error('user not found')
  
          // Create new access and refresh tokens for this session.
          await createTokens(session.ownerId, session.token, request, reply)
  
          return user
        } else {
          throw new Error('no valid session found');
        }
      } else {
        //throw new Error('no access token or refresh token found');
        // try to get token from bearer
      }
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
      const user = await getUser(request, reply)
  
      // Hash "oldPassword" and compare it to the current hashed password.
      const matches = await service.Compare(bcrypt, oldPassword, user?.password || '')
      if (matches) {
        const hashedPassword = await service.MakeHash(bcrypt, newPassword, saltLength)

        await service.UpdatePasswordWithEmail(prisma, unencodedEmail, hashedPassword)
        reply.send('changed password')
      } else {
        reply.code(400).send('invalid email or password');
      }
    } catch (e) {
      console.error('changePassword error:', e)
      reply.code(500).send('error changing password: ' + e)
    }

}

async function createTokens(userId:string, sessionToken:string, request:FastifyRequest, reply:FastifyReply) {
  const jwt = request.server.jwt
  const accessTokenDelay = request.server.env.ACCESS_TOKEN_MINUTES
  const refreshTokenDelay = request.server.env.REFRESH_TOKEN_DAYS
  const cookieOptions = request.server.cookieOptions 

  try {
    const accessToken = jwt.sign({userId, sessionToken})
    const accessExpires = service.GetExpires(accessTokenDelay)
    service.CreateCookie(cookieOptions, reply, 'access-token', accessToken, accessExpires)

    const refreshToken = jwt.sign({sessionToken})
    const refreshExpires = service.GetExpires(refreshTokenDelay)
    service.CreateCookie(cookieOptions, reply, 'refresh-token', refreshToken, refreshExpires)
  } catch (e) {
    console.error('createTokens error:', e);
    throw new Error('error refreshing tokens')
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
    const hashedPassword = await service.MakeHash(bcrypt, password, salt)

    const userData = {
      email,
      password:hashedPassword,
      salt,
      verified: false
    }

    // Insert a record into the "user" collection.
    await service.CreateUser(prisma, userData)

    // After successfully creating a new user, automatically log in.
    await login(request, reply);

    // Send email to user containing a link
    // they can click to verify their account.
    // Some operations could require the user to be verified.
    await sendVerifyEmail(email);
  } catch (e) {
    console.error('createUser error:', e)
    reply.code(500).send(e)
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

async function verifyUser(request:FastifyRequest, reply:FastifyReply) {

}

async function register2FA(request:FastifyRequest, reply:FastifyReply) {

}

async function login2FA(request:FastifyRequest, reply:FastifyReply) {

}

export { 
    getProtectedData as GetProtectedDataHandler,
    getUnprotectedData as GetUnprotectedDataHandler,
    getUser as GetUserHandler,
    forgotPassword as ForgotPasswordHandler,
    changePassword as ChangePasswordHandler,
    createUser as CreateUserHandler,
    deleteCurrentUser as DeleteCurrentUserHandler,
    deleteUser as DeleteUserHandler,
    deleteUserSessions as DeleteUserSessionsHandler,
    getNewPassword as GetNewPasswordHandler,
    resetPassword as ResetPasswordHandler,
    verifyUser as VerifyUserHandler,
    register2FA as Register2FAHandler,
    login2FA as Login2FAHandler,
}