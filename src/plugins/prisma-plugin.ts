import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'

async function initDatabaseConnection(): Promise<PrismaClient> {
    const db = new PrismaClient({
        log: [{ level: 'query', emit: 'event' }, 'info', 'warn', 'error'],
        errorFormat: 'pretty'
    })
    await db.$connect()
    return db
}

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin = fp(async (server) => {
    const prisma = await initDatabaseConnection()
  
    // Make Prisma Client available through the fastify server instance: server.prisma
    server.decorate('prisma', prisma)
    // server.addHook('on', async () => {
    //     await prisma.$disconnect()
    // })
    server.addHook('onClose', async () =>  {
      await server.prisma.$disconnect()
    })

    //await server.after()
    server.log.info('Prisma Plugin Installed.')
})

export { prismaPlugin as PrismaPlugin }