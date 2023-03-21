import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { CreateProductInput } from "./product.schema"
import { CreateProductService, GetManyProductsService } from "./product.service"
import { UserPayload } from "../../plugins/auth/jwt-plugin"

async function createProduct(
    request: FastifyRequest<{
        Body: CreateProductInput
    }>, reply:FastifyReply) {

    const prisma = request.server.prisma
    const user = request.user as UserPayload
    const ownerId = user.id//userIdFromRequest(request, reply)
    console.log(request)
    console.log(ownerId)

    const product = await CreateProductService(
        prisma, { 
            ...request.body,
            ownerId: ownerId
        }
    )
    reply.code(200).send(product)
}

async function getManyProducts(
    request:FastifyRequest,
    reply:FastifyReply) {
        const prisma = request.server.prisma
        const products = await GetManyProductsService(prisma)
        reply.code(200).send(products)
    }

export {
    createProduct as CreateProductHandler,
    getManyProducts as GetManyProductsHandler
}