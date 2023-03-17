import Fastify, { FastifyServerOptions, FastifyInstance } from 'fastify'
import plugins from './plugins'

import { UserRoutes } from './modules/user/user.route'
import { UserSchemas } from './modules/user/user.schema'

import { ProductRoutes } from './modules/product/product.route'
import { ProductSchemas } from './modules/product/product.schema'

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
    fastify.register(plugins.AuthPlugin)
    fastify.register(plugins.PrismaPlugin)
    fastify.register(plugins.MinCryptoPlugin)
    fastify.register(plugins.SwaggerPlugin)

    fastify.register(plugins.PothosPlugin)

    /* Here we should register all gql query fields */
    fastify.register(BuildUserQuery)
    fastify.register(BuildPostQuery)
    fastify.register(BuildProductQuery)

    fastify.register(plugins.MercuriusPlugin)
    
    fastify.register(UserRoutes, { prefix: 'api/users' })
    fastify.register(ProductRoutes, { prefix: 'api/products' })
    return fastify
}

async function startApp(server:FastifyInstance, host:string, port:number) {
    
    server.get('/healthcheck', async function() {
        return { status: 'ok' }
    })
  
    try {
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