import { FastifyReply } from "fastify"
import { CookieOptions } from "../../../plugins/auth/cookie-plugin"

function getExpires(delay: number): Date {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + delay)
    return expires
}

function createCookie(cookieOptions:CookieOptions,
    reply:FastifyReply, 
    fieldName:string, fieldValue:string, 
    expires:Date
    ) : any {
        reply
        .setCookie(fieldName, fieldValue, {...cookieOptions, expires:expires}) 
}

export { 
    createCookie as CreateCookie,
    getExpires as GetExpires
}