import {FastifyRequest, FastifyReply} from 'fastify'

export function userIdFromRequest (request:FastifyRequest, reply:FastifyReply): string {
    const ownerId = Object(request.user).id || '' 
    if (ownerId.length === 0) {
        reply.code(201).send('Not available operation for undefined user')    
    }
    return ownerId
} 
