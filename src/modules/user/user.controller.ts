import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { CreateUserInput } from "./user.schema";
import { CreateUserService } from "./user.service";

async function register(
    request:FastifyRequest<{ Body: CreateUserInput }>, 
    reply:FastifyReply
) {
    const { body, server } = request
    try {
        const user = await CreateUserService(server.prisma, server.minCrypto, body)
        return reply.code(201).send(user)

    } catch (e) {
        return reply.code(500).send(e)
    }
}
export { register as RegisterUserHandler } 

