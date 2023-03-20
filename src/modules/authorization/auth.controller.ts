
import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"

import { 
  LoginInput,
  CreateUserInput, 
  CreateTokensInput,
  ChangePasswordInput,
  SendVerifyEmailInput
} from "./auth.schema"

import service from "./service"
import { User } from "@prisma/client"


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
    if (accessToken) {
      const decodedPayload = await service.Verify(jwt, accessToken) 
      const user = await service.GetUniqueUser(prisma, {id:decodedPayload.id})
      return user

    } else {
      const refreshToken = request.cookies['refresh-token']
      if (refreshToken) {
        // This should throws if refreshToken is not valid. But we should check it
        const decodedRefreshToken = await service.Verify(jwt, refreshToken)
        
        const session = await service.GetUniqueSession(prisma, {token:decodedRefreshToken.id})
        if (session && session.valid) {
          const user = await service.GetUniqueUser(prisma, {id:session.userId})
          if (!user) throw new Error('user not found')
  
          // Create new access and refresh tokens for this session.
          await createTokenCookies({
            userId: session.userId, 
            sessionToken: session.token, 
            request, reply})
  
          return user
        } else {
          throw new Error('no valid session found');
        }
      } else {
        //throw new Error('no access token or refresh token found');
        // try to get token from bearer
        //const jwtPayload = jwt.decode(
        //  req.header('authorization')!
        //) as JwtExpPayload
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
        const salt = await service.GenerateSalt(bcrypt, saltLength)
        const hashedPassword = await service.Hash(bcrypt, newPassword, salt)
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

async function createTokenCookies(p: CreateTokensInput) {
  const jwt = p.request.server.jwt
  const accessTokenMinutes = p.request.server.env.ACCESS_TOKEN_MINUTES
  const refreshTokenDays = p.request.server.env.REFRESH_TOKEN_DAYS
  const cookieOptions = p.request.server.cookieOptions 

  try {
    const accessToken = await service.Sign(jwt, {userId: p.userId, sessionToken: p.sessionToken})
    const accessExpires = service.NowPlusMinutes(accessTokenMinutes)
    const accessOptions = {...cookieOptions, expires:accessExpires}
    service.CreateCookie( {reply:p.reply, 
      name:'access-token', value:accessToken, 
      options:accessOptions})

    const refreshToken = await service.Sign(jwt, {sessionToken:p.sessionToken})
    const refreshExpires = service.NowPlusDays(refreshTokenDays)
    const refreshOptions = {...cookieOptions, expires:refreshExpires}
    service.CreateCookie({reply: p.reply,
      name: 'refresh-token', value: refreshToken,
      options: refreshOptions})

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
    const hashedPassword = await service.Hash(bcrypt, password, salt)

    // Insert a record into the "user" collection.
    const data = { email, password:hashedPassword, salt, verified: false }
    await service.CreateUser(prisma, data)

    // After successfully creating a new user, automatically log in.
    await login(request, reply)

    // Send email to user containing a link
    // they can click to verify their account.
    // Some operations could require the user to be verified.
    await sendVerifyEmail(request, email)
  } catch (e) {
    console.error('createUser error:', e)
    reply.code(500).send(e)
  }
}

async function sendVerifyEmail(request:FastifyRequest, email: string) {

  const mailer = request.server.nodemailer

  const domain = 'api.' + request.server.env.ROOT_DOMAIN
  const link_expires = request.server.env.LINK_EXPIRE_MINUTES
  const expires = service.NowPlusMinutes(link_expires).getTime().toString()
  const encodedEmail = encodeURIComponent(email)

  const crypto = request.server.minCrypto
  const signature = request.server.env.JWT_SIGNATURE
  
  const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')
  const link =
    `https://${domain}/verify/` + `${encodedEmail}/${expires}/${emailToken}`

  // Send an email containing a link that can be clicked
  // to verify the associated user.
  const subject = 'Verify your account'
  const html =
    'Click the link below to verify your account.<br><br>' +
    `<a href="${link}">VERIFY</a>`
  //return sendEmail({to: email, subject, html})
  return await service.SendMail(mailer, {to: email, subject, html})
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

async function login(request:FastifyRequest<{
  Body: LoginInput
}>, reply:FastifyReply) 
{
  const {email, password} = request.body
  const prisma = request.server.prisma
  const bcrypt = request.server.bcrypt
  try {
      const user = await service.GetUniqueUser(prisma, {email})
      if (user && user.verified) {
        
        const doubleCheck = await service.Compare(bcrypt, user.password, password)
        if (!doubleCheck) {
          throw new Error('User seems varified in system, but password is incorrect')
        }
        // If the user has enabled two-factor authentication (2FA) ...
        // Don't login until a 2FA code is provided.
        if (user.secret) { 
          reply.send({userId: user.id, status: '2FA'})
        
        } else {
          // 2FA is not enabled for this account,
          // so create a new session for this user.
          await createSession(request, reply, user)
          reply.send('logged in')
        }
    } else {
      reply.code(401).send('invalid email or password')
    }
  } catch (e) {
    console.error('login error:', e)
    reply.code(500).send(e)
  }
}

async function logout(request:FastifyRequest, reply:FastifyReply) {

}

async function createSession(request:FastifyRequest, reply:FastifyReply, user:User) {
  const tokenLength = request.server.env.SESSION_TOKEN_LENGTH
  const bcrypt = request.server.bcrypt
  const prisma = request.server.prisma
  const sessionToken = await service.GenerateSalt(bcrypt, tokenLength) 

  try {    
    const userAgent = request.headers['user-agent'] || ''
    await service.CreateSession(prisma, {
      userId: user.id,
      token: sessionToken,
      isMobile:service.IsMobile(userAgent),
      userAgent
    })
    // Create cookies containing access and refresh tokens.
    await createTokenCookies({ userId: user.id, sessionToken, request, reply})
  } catch (e) {
    throw new Error('session creation failed')
  }
}

export { 
    login as LoginHandler, 
    logout as LogoutHandler,
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