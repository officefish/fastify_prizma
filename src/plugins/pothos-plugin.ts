import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'

import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'

import { Prisma } from '@prisma/client'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { FastifyRequest, FastifyReply } from 'fastify'

type PothosSchemaBuilder = PothosSchemaTypes.SchemaBuilder<PothosSchemaTypes.ExtendDefaultTypes<{
    Context: {
        request: FastifyRequest
        reply: FastifyReply
        prisma: PrismaClient
    }
    PrismaTypes: PrismaTypes
    AuthScopes: {
        authenticate: boolean
    }
}>>

async function initBuilder(prisma:PrismaClient): Promise<PothosSchemaBuilder> {
    const builder = await new SchemaBuilder<{
        Context: {
            request: FastifyRequest,
            reply: FastifyReply,
            prisma: PrismaClient
        }
        PrismaTypes: PrismaTypes
        AuthScopes: {
            authenticate: boolean
        }
    }>({
        plugins: [PrismaPlugin, ScopeAuthPlugin],
        prisma: {
            client: prisma,
                // Because the prisma client is loaded dynamically, we need to explicitly provide the some information about the prisma schema
            dmmf: Prisma.dmmf,
            // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
            filterConnectionTotalCount: true,
        },
        authScopes: async (context) => ({
            authenticate: context.request.server.user.id !== '',
        }),
    })
    
    return builder
}

// Use TypeScript module augmentation to declare the type of server.schema.builder to be SchemaBuilder
declare module 'fastify' {
    interface FastifyInstance {
        schema: {
            builder: PothosSchemaBuilder
        } 
    }
}

const pothosPlugin = fp(async (server) => {
    const builder = await initBuilder(server.prisma)  
    server.decorate('schema', {builder})

    //await server.after()
    server.log.info('Pothos Plugin Installed.')
})

export { 
    pothosPlugin as PothosPlugin,
    PothosSchemaBuilder
}