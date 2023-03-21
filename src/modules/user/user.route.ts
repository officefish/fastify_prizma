import { FastifyInstance } from "fastify"
import { LoginUserHandler, RegisterUserHandler, GetUsersHandler } from "./user.controller"
import { $ref } from "./user.schema"

async function routes(server:FastifyInstance) {

    server.post('/', {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('createUserResponseSchema'),
            }
        },
    }, RegisterUserHandler)

    server.post('/auth', {
        schema: {
            body: $ref('loginUserSchema'),
            response: {
                200: $ref('loginUserResponseSchema'),
            }
        }
    }, LoginUserHandler)

    server.get('/', {
        preHandler: [server.authenticate]
    }, GetUsersHandler)

    //await server.after()
    server.log.info('User routes added.')
}

export { routes as UserRoutes } 