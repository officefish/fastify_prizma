import Fastify, { FastifyServerOptions, FastifyInstance } from 'fastify'
import plugins from './plugins'

import { UserRoutes } from './modules/user/user.route'
import { UserSchemas } from './modules/user/user.schema'

import { ProductRoutes } from './modules/product/product.route'
import { ProductSchemas } from './modules/product/product.schema'

import { AuthRoutes } from './modules/authorization/auth.route'
import { AuthSchemas } from './modules/authorization/auth.schema'

import { BuildPostQuery } from './modules/post/post.query'
import { BuildUserQuery } from './modules/user/user.query'
import { BuildProductQuery } from './modules/product/product.query'

export type AppOptions = Partial<FastifyServerOptions>

async function buildApp(options: AppOptions = {}) {
    const fastify = Fastify(options)

    for (const schema of [...AuthSchemas, ...UserSchemas, ...ProductSchemas]) {
        fastify.addSchema(schema)
    }

    //fastify.register(plugins.ShutdownPlugin)

    fastify.register(plugins.DotEnvPlugin)
    fastify.register(plugins.MinCryptoPlugin)
    fastify.register(plugins.MailPlugin)
    
    fastify.register(plugins.JwtPlugin)
    fastify.register(plugins.CookiePlugin)
    /* Session plugin need cookie and minCrypto plugins */
    fastify.register(plugins.SessionPlugin) 

    fastify.register(plugins.PrismaPlugin)
    fastify.register(plugins.PothosPlugin)

    /* Here we should register all gql query fields. 
    Using before mercurius plugin init for build all qraphql schemas */
    fastify.register(BuildUserQuery)
    fastify.register(BuildPostQuery)
    fastify.register(BuildProductQuery)

    fastify.register(plugins.MercuriusPlugin)

    /* Should be registered before routes */
    fastify.register(plugins.SwaggerPlugin)

    fastify.register(UserRoutes, { prefix: 'api/users' })
    fastify.register(ProductRoutes, { prefix: 'api/products' })
    fastify.register(AuthRoutes, {prefix: 'api/auth'})

    

    return fastify
}

async function startApp(server:FastifyInstance) {
    
    server.ready(err => {
      if (err) server.log.error(err)
      console.log(server.printRoutes())
    })

    server.get('/healthcheck', (request) => {
        return { status: 'ok' }
    })

    server.get('/', (request, reply) => {
      console.log(request.cookies)
      //console.log(request.session)
      reply
        .send(request.cookies.sessionId)
    })

    try {
      const port = server.env.ROOT_PORT || 8001
      const host = server.env.ROOT_DOMAIN || '0.0.0.0'

      await server.listen({
        port: port,
        host: host,
      }, (err) => {
        if (err) server.log.error(err)
      })  

      await server.after() 
      
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
}

async function buildEmpty () {
  const fastify = Fastify()
  return fastify
}

export { buildApp, buildEmpty, startApp }