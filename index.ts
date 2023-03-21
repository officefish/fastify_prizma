import { buildApp, startApp, AppOptions, buildEmpty } from './src/app'
import { mock } from './src/services/mock.service'

const options: AppOptions = {
    logger: true,
}

const start = async () => {
    const app = await buildApp(options)
    await startApp(app)
}
  
start()