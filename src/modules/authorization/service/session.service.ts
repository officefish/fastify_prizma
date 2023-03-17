import { PrismaClient } from "@prisma/client"

type Session = {
    valid: boolean,
    userId: string
}

async function getSession(prisma:PrismaClient, sessionToken: string) {
   
}

async function updateSession(prisma:PrismaClient, sessionToken: string, newSessionToken: string) : Promise<Session> {
    return new Promise<Session>((resolve, reject) => {})
}

export { 
    getSession as GetSession, 
    updateSession as UpdateSession }