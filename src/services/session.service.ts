import { PrismaClient, Prisma } from "@prisma/client"
import Session from '@prisma/client'

import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"

import { CreateCookie } from "./cookie.service"

import { Role } from "@prisma/client"

async function createSession(prisma:PrismaClient, data: Prisma.SessionUncheckedCreateInput) {
    const session = await prisma.session.create({data})
    return session
}

async function getUniqueSession(prisma:PrismaClient, data:Prisma.SessionWhereUniqueInput) {
    const session = await prisma.session.findUnique({ where: data})
    return session
}

type RegenerateSessionInput = {
    request:FastifyRequest
    reply:FastifyReply
    userId?: string 
    userRole?: Role 
}

async function regenerateSession(input:RegenerateSessionInput) {

    const maxAge = input.request.server.env.SESSION_MAX_AGE
    const sessionExpires = new Date(Date.now() + maxAge)
    const options = {...input.request.server.cookieOptions, expires:sessionExpires}    

    await input.request.session.regenerate()
    CreateCookie( 
            {reply:input.reply, 
            name:'sessionId', value: input.request.session.id || '', 
            options})

    const sessionToken = input.request.session.id || ''
    input.request.session.userId = input.userId
    input.request.session.userRole = input.userRole || Role.GUEST 

    return {sessionToken, options}
}

async function updateSession(prisma:PrismaClient, sessionToken: string, newSessionToken: string) {
    return 
}

export { 
    createSession as CreateSession,
    regenerateSession as RegenerateSession,
    getUniqueSession as GetUniqueSession, 
    updateSession as UpdateSession }