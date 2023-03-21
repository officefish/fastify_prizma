import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"

import { 
  LoginInput,
  CreateTokensInput,
  SendVerifyEmailInput
} from "./auth.schema"

import service from '../../services'
import userService from "../user/user.service"
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


async function initialize (request:FastifyRequest ) {    
  const jwttoken = request.headers['authorization']
  const tokenArray = jwttoken?.toString().split(" ") || []
  const tokenPayload = tokenArray[1] && request.server.jwt.decode(tokenArray[1])
  const identity = tokenPayload && Object(tokenPayload).id || '' 
  request.user = Object(tokenPayload)
  request.server.user.id =  identity
}


async function authenticate(request:FastifyRequest, reply:FastifyReply) {

  const jwt = request.server.jwt
  const prisma = request.server.prisma

  const accessToken = request.cookies['access-token'] as string
  if (accessToken) {
    const decodedPayload = await service.Verify(jwt, accessToken) 
    const user = await userService.GetUniqueUser(prisma, {id:decodedPayload.id})
    return user

  } else {
    const refreshToken = request.cookies['refresh-token']
    if (refreshToken) {
      // This should throws if refreshToken is not valid. But we should check it
      const decodedRefreshToken = await service.Verify(jwt, refreshToken)
      
      const session = await service.GetUniqueSession(prisma, {token:decodedRefreshToken.id})
      if (session && session.valid) {
        const user = await userService.GetUniqueUser(prisma, {id:session.userId})
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
      const user = await userService.GetUniqueUser(prisma, {email})
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
    initialize as InitializeHandler,
    authenticate as AuthenticateHandler,
    login as LoginHandler, 
    logout as LogoutHandler,
    getProtectedData as GetProtectedDataHandler,
    getUnprotectedData as GetUnprotectedDataHandler,
    verifyUser as VerifyUserHandler,
    register2FA as Register2FAHandler,
    login2FA as Login2FAHandler,
}

export const authController = {
  login
}
