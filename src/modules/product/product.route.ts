import { FastifyInstance } from "fastify"
import { CreateProductHandler, GetManyProductsHandler } from "./product.controller"
import { $ref } from "./product.schema"

async function routes(server:FastifyInstance) {

    server.post("/", {
        preHandler: [server.authenticate],
        schema: {
            body: $ref("createProductSchema"),
            response: {
                201: $ref("productResponseSchema")
            }
        }
    }, CreateProductHandler)

    server.get("/", {
        schema: {
            response: {
                201: $ref("productResponseSchema")
            }
        }
    }, GetManyProductsHandler);
}

export { routes as ProductRoutes}