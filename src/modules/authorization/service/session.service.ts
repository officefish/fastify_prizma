import { PrismaClient, Prisma } from "@prisma/client"
import Session from '@prisma/client'


async function createSession(prisma:PrismaClient, data: Prisma.SessionUncheckedCreateInput) {
    const session = await prisma.session.create({data})
    return session
}

async function getUniqueSession(prisma:PrismaClient, data:Prisma.SessionWhereUniqueInput) {
    const session = await prisma.session.findUnique({ where: data})
    return session
}

async function updateSession(prisma:PrismaClient, sessionToken: string, newSessionToken: string) {
    return 
}

export { 
    createSession as CreateSession,
    getUniqueSession as GetUniqueSession, 
    updateSession as UpdateSession }