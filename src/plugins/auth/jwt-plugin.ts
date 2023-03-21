
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
    .ready((err) => {
        if (err) console.error(err)  
    })
    
    server.addHook('onRoute', (routeOptions) => {
        if (routeOptions.url === '/graphql') {
          routeOptions.preHandler = [server.initialize]
        }
    })
   
    //await server.after()
    server.log.info('Jwt Plugin Installed.')
})

export { 
    jwtPlugin as JwtPlugin,
    UnivocalJwt, UserPayload, JwtExpPayload 
}