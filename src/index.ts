import { buildApp, AppOptions } from './app'
//import { main } from './services'

const options: AppOptions = {
    logger: true,
}

const start = async () => {
    const app = await buildApp(options)

    app.get('/healthcheck', async function() {
        return { status: 'ok' }
    })
  
    try {
      await app.listen({
        port: 8001,
        host: '0.0.0.0',
      })

      //await main(app.prisma)
      
    } catch (err) {
      app.log.error(err);
      process.exit(1)
    }
  }
  
start()