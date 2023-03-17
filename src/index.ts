import { buildApp, startApp, AppOptions } from './app'
import { mock } from './services/mock.service'

const options: AppOptions = {
    logger: true,
}

const HOST = '0.0.0.0'
const PORT = 8001

const start = async () => {
    const app = await buildApp(options)
    startApp(app, HOST, PORT)
}
  
start()