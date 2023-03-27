import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { withRefResolver } from 'fastify-zod'
import { version } from '../../package.json'

const swaggerPlugin = fp(async (server) => {
    
    server.register(swagger, withRefResolver({
        exposeRoute: true,
        openapi: {
            info: {
                title: 'Techies blog API',
                version: version,
            },
            tags: [
                { name: 'auth', description: 'Authorize User related end-points.' },
                { name: 'user', description: 'User related end-points.' },
                { name: 'password', description: 'User password related end-points.' },
                { name: 'session', description: 'User session related end-points.' },
                { name: 'role', description: 'User role related end-points.' }
              ],
        }
    }))
    server.register(swaggerUI, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        // uiHooks: {
        //     onRequest: function (request, reply, next) { next() },
        //     preHandler: function (request, reply, next) { next() }
        // },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true,    
    })

    //await server.after()
    server.log.info('Swagger plugin installed.')
})

export { swaggerPlugin as SwaggerPlugin }