
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

declare module 'fastify' {
    interface FastifyInstance {
        jwtVerify: any,
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
    
    const userContext = {}
    server.decorate('user', { getter: () => userContext })
    
    server.register(jwt, { secret: server.env.JWT_SIGNATURE })
    .ready((err) => {
        if (err) console.error(err)  
    })
    
    //await server.after()
    server.log.info('Jwt Plugin Installed.')
})

export { 
    jwtPlugin as JwtPlugin,
    UnivocalJwt, UserPayload, JwtExpPayload 
}