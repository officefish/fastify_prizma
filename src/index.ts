import { buildApp, startApp, AppOptions } from './app'
import { mock } from './services/mock.service'

const options: AppOptions = {
    logger: true,
}

const start = async () => {
    const app = await buildApp(options)
    startApp(app)
}
  
start()