import { PrismaClient } from "@prisma/client"



async function getSession(prisma:PrismaClient, token: string) {
    const session = await prisma.session.findUnique({
        where: {
          token: token
        },
    })
    return session
}

async function updateSession(prisma:PrismaClient, sessionToken: string, newSessionToken: string) {
    return 
}

export { 
    getSession as GetSession, 
    updateSession as UpdateSession }