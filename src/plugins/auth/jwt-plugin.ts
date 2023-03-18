
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

interface UnivocalJwt {
    user: {
       email: string
       name: string
       userId: number
    }
}

interface UserPayload {
    id: string
}

interface JwtExpPayload {
    expiresIn: string
    exp: number
}


const jwtPlugin = fp(async (server) => {
    server.decorate('initialize', InitializeHandler)
    server.decorate('authenticate', AuthenticateHandler)
    server.decorate('user', {})
    server.register(jwt, { secret: server.env.JWT_SIGNATURE })
    
    server.addHook('onRoute', (routeOptions) => {
        if (routeOptions.url === '/graphql') {
          //routeOptions.preValidation = [server.authenticate]
          routeOptions.preHandler = [server.initialize]
        }
    })
})

export { 
    jwtPlugin as JwtPlugin,
    UnivocalJwt, UserPayload, JwtExpPayload 
}