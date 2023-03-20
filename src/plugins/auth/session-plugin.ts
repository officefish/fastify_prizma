import fp from 'fastify-plugin'
import fastifySession from '@fastify/session'

const sessionPlugin = fp(async (server) => {
    
    //const sig = server.env.SESSION_SIGNATURE
    //const secret = server.minCrypto.sha1(sig)

    const secretLength = server.env.SESSION_TOKEN_LENGTH
    const secret = server.bcrypt.genSalt(secretLength)

    server.register(fastifySession, {secret})  
})

export { sessionPlugin as SessionPlugin }