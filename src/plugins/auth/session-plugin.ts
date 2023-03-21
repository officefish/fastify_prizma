import fp from 'fastify-plugin'
import { fastifySession } from '@fastify/session'
import fastifyCookie from '@fastify/cookie'

declare module "fastify" {
    interface Session {
        user_id: string
        other_key: string
        id?: string
    }
}

const sessionPlugin = fp(async (server) => {
    
    //const sig = server.env.SESSION_SIGNATURE
    //const secret = server.minCrypto.sha1(sig)

    const secretLength = server.env.SESSION_TOKEN_LENGTH
    const secret = server.env.SESSION_SIGNATURE//await server.bcrypt.genSalt(128)

    //server.register(require('@fastify/cookie'),{hook:'onRequest'})
    server.register(fastifySession, {
        secret,
        cookieName: 'sessionId', 
        cookie: { secure: false }, }) 
    .ready((err) => {
        if (err) console.error(err)  

        // const { sessionId } = {sessionId:'someId'}//server.parseCookie(cookieHeader);
        // const request = {}
        // server.decryptSession(sessionId, request, () => {
        //     // request.session should be available here
        // })
    })

    
    
    // server.addHook('onRequest', (request, reply, next) => {
    //     console.log(request.cookies)
    //     console.log(request.session)
    //     //request.session.set()
    //     //next()
    // })
    //await server.after()
    server.log.info('Session Plugin Installed.') 
})

export { sessionPlugin as SessionPlugin }