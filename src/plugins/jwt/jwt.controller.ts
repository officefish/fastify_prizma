import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"

async function authentication (
    request:FastifyRequest, 
    reply:FastifyReply
) {
    if (!request.jwtVerify) {
        return reply.code(401).send({ message: "Server has no jwt plugin installed." })
    }
    try {
        await request.jwtVerify()
    } catch (error) {
        return reply.code(401).send(error)
    }
}
export {authentication as AuthenticateHandler} 