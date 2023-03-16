import { FastifyPluginAsync } from 'fastify'

const shutdown: FastifyPluginAsync = async (server, options) => {
  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())
}

export { shutdown as ShutdownPlugin }