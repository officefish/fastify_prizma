import Fastify, { FastifyServerOptions } from 'fastify'
import plugins from './plugins'


import { UserRoutes } from './modules/user/user.route'
import { UserSchemas } from './modules/user/user.schema'

export type AppOptions = Partial<FastifyServerOptions>

async function buildApp(options: AppOptions = {}) {
    const fastify = Fastify(options)

    for (const schema of UserSchemas) {
        fastify.addSchema(schema)
    }

    fastify.register(plugins.PrismaPlugin)
    fastify.register(plugins.MinCryptoPlugin)

    fastify.register(UserRoutes, { prefix: 'api/users' })
    return fastify
}
export { buildApp }