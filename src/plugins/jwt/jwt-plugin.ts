
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { AuthenticateHandler } from './jwt.controller'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any,
    }
}

const jwtPlugin = fp(async (server) => {
    server.decorate('authenticate', AuthenticateHandler)
    server.register(jwt, { secret: "very very very secret" })
})

export { jwtPlugin as AuthPlugin }