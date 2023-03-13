import { FastifyInstance } from "fastify"
import { RegisterUserHandler } from "./user.controller"

async function routes(server:FastifyInstance) {

    server.post('/', RegisterUserHandler)
}

export { routes as UserRoutes } 