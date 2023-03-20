import fp from 'fastify-plugin'

const shutdown = fp(async (server) => {
  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())
})

export { shutdown as ShutdownPlugin }