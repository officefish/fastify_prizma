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

async function initialization (
    request:FastifyRequest, 
) {    
    const jwttoken = request.headers['authorization']
    const tokenArray = jwttoken?.toString().split(" ") || []
    const tokenPayload = tokenArray[1] && request.server.jwt.decode(tokenArray[1])
    const identity = tokenPayload && Object(tokenPayload).id || '' 
    request.user = Object(tokenPayload)
    request.server.user.id =  identity
}

export {
    authentication as AuthenticateHandler,
    initialization as InitializeHandler
} 