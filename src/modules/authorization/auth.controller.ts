import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { FastifyError } from "fastify"
import { HookHandlerDoneFunction } from "fastify"

import { 
  LoginInput,
  VerifyUserInput,
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
    try {
      const accessToken = request.cookies['access-token'] || ""
      await service.Verify(jwt, accessToken)
    
    } catch (e) {
      try {
        const refreshToken = request.cookies['refresh-token'] || ""
        await service.Verify(jwt, refreshToken)

        const userId = request.session.userId || ""
        const userRole = request.session.userRole
        const {sessionToken} =  await service.RegenerateSession({request, reply, userId, userRole})
        await createTokenCookies({ userId, sessionToken, request, reply})

        // maybe need to send verify email one more time?
      } catch (e) {
        //console.error(e)
        reply.code(400).send({error: { message:'Access token required'}})
      }
  }
}

async function verifyUser(request:FastifyRequest<{
  Params: VerifyUserInput
}>, reply:FastifyReply) {
    const {expires, token} = request.params
    const email = decodeURIComponent(request.params.email)
    // Determine if the token matches the
    // specified email and expires timestamp.
    const crypto = request.server.minCrypto
    const signature = request.server.env.JWT_SIGNATURE

    const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')
    const matches = token === emailToken
  
    if (!matches || Date.now() > +expires) {
      reply.code(400).send({error: { message:'verify link expired'}})
      return
    }
  
    try {

      const prisma = request.server.prisma
      const user = await userService.UpdateUser(prisma, {email, verified:true})
      reply.code(200).send({verified: user.verified})

    } catch (e) {
      console.error('verifyUser error:', e)
      reply.code(500).send('error verifying user: ' + e)
    }
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
      const samePassword = await service.Compare(bcrypt, password, user?.password || '')
      if (user && samePassword) {
        // If the user has enabled two-factor authentication (2FA) ...
        // Don't login until a 2FA code is provided.
        if (user.secret) { 
          reply.send({userId: user.id, status: '2FA'})

        } else {
          // 2FA is not enabled for this account,
          // so create a new session for this user.
          //await updateSession(request, reply, user)
          const userId = user.id
          const userRole = user.role
          const {sessionToken} = await service.RegenerateSession({request, reply, userId, userRole})
          await createTokenCookies({ userId, sessionToken, request, reply})
          
          if (!user.verified) {
            await sendVerifyEmail(request, reply, email)
          }

          const replyPayload = {
            'access-token': reply.cookies['access-token'],
            'verified': user.verified
          }
          reply.send(replyPayload)
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
  try {
        
        const {options} = await service.RegenerateSession({request, reply})
      
        // Clear the access and refresh token cookies for this session.
        service.ClearCookie({reply, name:'access-token', options})
        service.ClearCookie({reply, name:'refresh-token', options})
        reply.code(200).send({status:'logged out'})
    
      } catch (e) {
        reply.code(400).send({error:e})
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
    service.CreateCookie( 
      {reply:p.reply, 
      name:'access-token', value:accessToken, 
      options:accessOptions})

    const refreshToken = await service.Sign(jwt, {sessionToken:p.sessionToken})
    const refreshExpires = service.NowPlusDays(refreshTokenDays)
    const refreshOptions = {...cookieOptions, expires:refreshExpires}
    service.CreateCookie(
      {reply: p.reply,
      name: 'refresh-token', value: refreshToken,
      options: refreshOptions})

  } catch (e) {
    console.error('createTokens error:', e);
    throw new Error('error refreshing tokens')
  }
}

async function sendVerifyEmail(request:FastifyRequest, reply:FastifyReply, email: string) {

    const mailer = request.server.nodemailer

    //const domain = 'api.' + request.server.env.ROOT_DOMAIN
    const domain = 'localhost:8001/api/auth'
    const link_expires = request.server.env.LINK_EXPIRE_MINUTES
    const expires = service.NowPlusMinutes(link_expires).getTime().toString()
   

    const crypto = request.server.minCrypto
    const signature = request.server.env.JWT_SIGNATURE

    const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')

    const encodedEmail = encodeURIComponent(email)
    const link =
      `http://${domain}/verify/` + `${encodedEmail}/${expires}/${emailToken}`

    // Send an email containing a link that can be clicked
    // to verify the associated user.
    const subject = request.server.env.SMTP_SUBJECT
    const from = request.server.env.FROM_EMAIL
    const html =
      'Click the link below to verify your account.<br><br>' +
      `<a href="${link}">VERIFY</a>`
    //return sendEmail({to: email, subject, html})
   
    try {    
      return await service.SendMail(mailer, {from, to: email, subject, html})   
    } catch (e) {
      reply.code(500).send(e)
      //reply.code(500).send('Error with sending vefification email.')
    }
}

async function updateSession(request:FastifyRequest, reply:FastifyReply, user:User) {
  //const tokenLength = request.server.env.SESSION_TOKEN_LENGTH
  //const bcrypt = request.server.bcrypt
  //const prisma = request.server.prisma
  

  try {    
    // const userAgent = request.headers['user-agent'] || ''
    // await service.CreateSession(prisma, {
    //   userId: user.id,
    //   token: sessionToken,
    //   isMobile:service.IsMobile(userAgent),
    //   userAgent
    // })
    // Create cookies containing access and refresh tokens.
    
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
  login,
  logout
}
