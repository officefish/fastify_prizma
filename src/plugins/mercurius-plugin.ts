import fp from 'fastify-plugin'
import {
    FastifyReply,
    FastifyRequest,
  } from 'fastify'
import mercurius from 'mercurius'
import path from 'path'
import fs from 'fs'
import { printSchema, lexicographicSortSchema } from 'graphql'
import { PrismaClient } from '@prisma/client'

interface Context {
  prisma: PrismaClient
  request: FastifyRequest, 
  reply: FastifyReply
}

const mercuriusPlugin = fp(async (server) => {

    const builder = server.schema.builder
    builder.queryType({
        fields: t => ({})
    })

    const schema = builder.toSchema({})

    /* Not neccesary but let it be */
    const schemaAsString = printSchema(lexicographicSortSchema(schema))
    if (process.env.NODE_ENV !== 'production') {
        fs.writeFileSync(path.join(process.cwd(), './schema.gql'), schemaAsString)
    }

    server.register(mercurius, {
        schema,
        path: '/graphql',
        graphiql: true,
        context: (request: FastifyRequest, reply: FastifyReply): Context => {
          return {
            prisma: server.prisma,
            request,
            reply,
          }
        },
        subscription: true
    }) 
})

export { mercuriusPlugin as MercuriusPlugin }

