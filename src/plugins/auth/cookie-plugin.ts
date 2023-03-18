import fp from 'fastify-plugin'
import fastifyCookie from '@fastify/cookie'
//Maybe also need:
//cookie-signature
//@types/cookie-signature

// Making cookies httpOnly prevents client-side scripts
// and browser extensions from accessing them.
// Making cookies "secure" requires the use of HTTPS
// to transmit them instead of HTTP.

export interface CookieOptions {
    domain: string
    httpOnly: boolean
    path: string
    secure: boolean 
}

declare module 'fastify' {
    interface FastifyInstance {
        cookieOptions: CookieOptions
    }
}

const cookiePlugin = fp(async (server) => {
    
    const cookieOptions = {
        domain: server.env.ROOT_DOMAIN,
        httpOnly: server.env.COOKIE_HTTPONLY,
        path: server.env.COOKIE_PATH,
        secure: server.env.COOKIE_SECURE 
    }
    server.decorate('cookieOptions', cookieOptions)

    // maybe wrong because COOKIE_SIGNATURE should be 32 length string
    
    server.register(fastifyCookie, {
        secret: server.env.COOKIE_SIGNATURE,
        hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
        parseOptions: {}
    })

})

export { cookiePlugin as CookiePlugin }
  
// fastify
//   app.register(fastifyCookie, {
//     secret: process.env.COOKIE_SIGNATURE
// })

//   .register(require('fastify-caching'))

//   .register(require('fastify-server-session'), {
//     secretKey: 'some-secret-password-at-least-32-characters-long',
//     sessionMaxAge: 1000 * 60 * 15, // 15 minutes
//     cookie: {
//       domain: 'localhost',
//       path: '/',
//       expires: 1000 * 60 * 15,
//       sameSite: 'Lax' // important because of the nature of OAuth 2, with all the redirects
//     }
//   })

//   .register(require('fastify-auth0'), {
//     domain: '',
//     client_id: '',
//     client_secret: '',
//     // optional
//     transformer: async function (credentials) {
//       credentials.log_in_date = new Date()
//       credentials.foo = 'bar'
//       // credentials.id = await someFunctionThatLooksUpId(credentials)
//       return credentials
//     },
//     // optional
//     success: async function (credentials) {
//       console.log(`${credentials.given_name} logged in at ${credentials.log_in_date}`)
//     }
//   })

// fastify.get('/', async function (request, reply) {
//   // the credentials returned from Auth0 will be available in routes as request.session.credentials
//   return reply.send({credentials: request.session.credentials})
// })

// fastify.listen(3000)
//   .then(function () {
//     console.log('listening on %s', fastify.server.address().port)
//   })
//   .catch(function (err) {
//     console.error(err.stack)
//   })