import fp from 'fastify-plugin'
import { InitializeHandler, AuthenticateHandler } from '../../modules/authorization/auth.controller'

const authPlugin = fp(async (server) => {
    server.decorate('initialize', InitializeHandler)
    server.decorate('authenticate', AuthenticateHandler)
    
    server.addHook('onRoute', (routeOptions) => {
        if (routeOptions.url === '/graphql') {
          routeOptions.preHandler = [server.initialize]
        }
    })
   
    //await server.after()
    server.log.info('Jwt Plugin Installed.')
})

export { 
    authPlugin as AuthPlugin,
}