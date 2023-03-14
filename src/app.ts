import Fastify, { FastifyServerOptions } from 'fastify'
import plugins from './plugins'

import { UserRoutes } from './modules/user/user.route'
import { UserSchemas } from './modules/user/user.schema'

import { ProductRoutes } from './modules/product/product.route'
import { ProductSchemas } from './modules/product/product.schema'

export type AppOptions = Partial<FastifyServerOptions>

async function buildApp(options: AppOptions = {}) {
    const fastify = Fastify(options)

    for (const schema of [...UserSchemas, ...ProductSchemas]) {
        fastify.addSchema(schema)
    }

    fastify.register(plugins.AuthPlugin)
    fastify.register(plugins.PrismaPlugin)
    fastify.register(plugins.MinCryptoPlugin)
    fastify.register(plugins.SwaggerPlugin)
    
    fastify.register(UserRoutes, { prefix: 'api/users' })
    fastify.register(ProductRoutes, { prefix: 'api/products' })
    return fastify
}
export { buildApp }