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

    server.addHook('onRoute', (routeOptions) => {
        if (routeOptions.url === '/graphql') {
          routeOptions.preHandler = [server.initialize]
        }
    })

    //await server.after()
    server.log.info('Mercurius Plugin Installed.')
})

export { mercuriusPlugin as MercuriusPlugin }

