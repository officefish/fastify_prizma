import Fastify, { FastifyServerOptions, FastifyInstance } from 'fastify'
import plugins from './plugins'

import { UserRoutes } from './modules/user/user.route'
import { UserSchemas } from './modules/user/user.schema'

import { ProductRoutes } from './modules/product/product.route'
import { ProductSchemas } from './modules/product/product.schema'

import { AuthRoutes } from './modules/authorization/auth.route'

import { BuildPostQuery } from './modules/post/post.query'
import { BuildUserQuery } from './modules/user/user.query'
import { BuildProductQuery } from './modules/product/product.query'

export type AppOptions = Partial<FastifyServerOptions>

async function buildApp(options: AppOptions = {}) {
    const fastify = Fastify(options)

    for (const schema of [...UserSchemas, ...ProductSchemas]) {
        fastify.addSchema(schema)
    }

    fastify.register(plugins.ShutdownPlugin)

    fastify.register(plugins.DotEnvPlugin)
    fastify.register(plugins.MinCryptoPlugin)
    fastify.register(plugins.MailPlugin)
    
    fastify.register(plugins.JwtPlugin)
    fastify.register(plugins.CookiePlugin)
    /* Session plugin need cookie and minCrypto plugins */
    fastify.register(plugins.SessionPlugin) 

    fastify.register(plugins.PrismaPlugin)
    fastify.register(plugins.PothosPlugin)

    fastify.register(plugins.SwaggerPlugin)

    /* Here we should register all gql query fields. 
    Using before mercurius plugin init for build all qraphql schemas */
    fastify.register(BuildUserQuery)
    fastify.register(BuildPostQuery)
    fastify.register(BuildProductQuery)

    fastify.register(plugins.MercuriusPlugin)
    
    fastify.register(UserRoutes, { prefix: 'api/users' })
    fastify.register(ProductRoutes, { prefix: 'api/products' })
    fastify.register(AuthRoutes, {prefix: 'api/auth'})
    return fastify
}

async function startApp(server:FastifyInstance) {

    //await server.after()

    server.log.info('Something important happened!')
    
    server.get('/healthcheck', async function() {
        return { status: 'ok' }
    })

    try {
      const port = server.env.ROOT_PORT || 8001
      const host = server.env.ROOT_DOMAIN || '0.0.0.0'

      console.log (port, host)
      await server.listen({
        port: port,
        host: host,
      })  
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