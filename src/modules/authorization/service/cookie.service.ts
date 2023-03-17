import { FastifyReply } from "fastify"

function getExpires(delay: number): Date {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + delay)
    return expires
}

function createCookie(cookie:any,
    reply:FastifyReply, 
    fieldName:string, fieldValue:string, 
    expires:Date
    ) : any {
    return 
}

export { 
    createCookie as CreateCookie,
    getExpires as GetExpires
}