import { FastifyInstance } from "fastify"
import { RegisterUserHandler } from "./user.controller"
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
}

export { routes as UserRoutes } 