import { PrismaClient } from '@prisma/client'
import { CreateProductInput } from './product.schema'

async function createProduct(
    prisma: PrismaClient, data: CreateProductInput & {ownerId: string}) {
        console.log(data)
    return prisma.product.create({
        data,
    })
}

async function getManyProducts(
    prisma: PrismaClient
) {
    return prisma.product.findMany({
        select: {
            content: true,
            title: true,
            price: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            owner: {
                select: {
                    name: true,
                    id: true,
                }
            }
        }
    })
}

export {
    createProduct as CreateProductService,
    getManyProducts as GetManyProductsService,
}
