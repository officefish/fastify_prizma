import fp from 'fastify-plugin'

const shutdown = fp(async (server) => {
  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())
  
  //await server.after()
  server.log.info('Shutdown Plugin Installed.')
})

export { shutdown as ShutdownPlugin }