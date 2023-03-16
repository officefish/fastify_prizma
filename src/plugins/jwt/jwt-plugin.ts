
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { AuthenticateHandler, InitializeHandler } from './jwt.controller'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any,
        initialize: any,
        user: {
            id: string
        }
    }
}

const jwtPlugin = fp(async (server) => {
    server.decorate('initialize', InitializeHandler)
    server.decorate('authenticate', AuthenticateHandler)
    server.decorate('user', {})
    server.register(jwt, { secret: "very very very secret" })
    
    server.addHook('onRoute', (routeOptions) => {
        if (routeOptions.url === '/graphql') {
          //routeOptions.preValidation = [server.authenticate]
          routeOptions.preHandler = [server.initialize]
        }
    })
})

export { jwtPlugin as AuthPlugin }