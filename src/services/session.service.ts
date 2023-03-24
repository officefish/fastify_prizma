import { PrismaClient, Prisma } from "@prisma/client"
import Session from '@prisma/client'

import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"

import { CreateCookie } from "./cookie.service"

async function createSession(prisma:PrismaClient, data: Prisma.SessionUncheckedCreateInput) {
    const session = await prisma.session.create({data})
    return session
}

async function getUniqueSession(prisma:PrismaClient, data:Prisma.SessionWhereUniqueInput) {
    const session = await prisma.session.findUnique({ where: data})
    return session
}

async function regenerateSession(request:FastifyRequest, reply:FastifyReply) {

    const maxAge = request.server.env.SESSION_MAX_AGE
    const sessionExpires = new Date(Date.now() + maxAge)
    const options = {...request.server.cookieOptions, expires:sessionExpires}    

    let userId = request.session.user_id

    await request.session.regenerate()
    CreateCookie( 
            {reply, 
            name:'sessionId', value: request.session.id || '', 
            options})

    const sessionToken = request.session.id || ''
    request.session.user_id = userId

    return {sessionToken, userId, options}
}

async function updateSession(prisma:PrismaClient, sessionToken: string, newSessionToken: string) {
    return 
}

export { 
    createSession as CreateSession,
    regenerateSession as RegenerateSession,
    getUniqueSession as GetUniqueSession, 
    updateSession as UpdateSession }