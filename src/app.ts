import Fastify, { FastifyServerOptions } from 'fastify'
//import prismaPlugin from './prisma.plugin'

import { UserRoutes } from './modules/user/user.route'

export type AppOptions = Partial<FastifyServerOptions>

async function buildApp(options: AppOptions = {}) {
    const fastify = Fastify(options)

    fastify.register(UserRoutes, { prefix: 'api/users' })
    return fastify
}
export { buildApp }