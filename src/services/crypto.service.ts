import { JWT } from "@fastify/jwt"
import { UserPayload } from "../plugins/auth/jwt-plugin"
import { SignPayloadType, SignOptions } from "@fastify/jwt"
import { MinCrypto, Bcrypt, JwtOptions } from "../plugins/min-crypto-plugin"

async function hash (crypto:Bcrypt, payload:string, salt:string)  {
    return await crypto.hash(payload, salt)
}

async function compare (crypto:Bcrypt, payload1:string, payload2:string) {
    return await crypto.compare(payload1, payload2)
}

async function genSalt (crypto:Bcrypt, length:number) {
    return await crypto.genSalt(length)
}

async function verify(jwt:JWT, token:string) {
    return await jwt.verify(token) as UserPayload
}

async function sign(jwt:JWT, payload: SignPayloadType, options?: Partial<SignOptions>) {
    return await jwt.sign(payload, options)
}

async function createJwt(crypto:MinCrypto, options:JwtOptions, separator: string = '') {
    return await crypto.createJwt(options, separator)
}

export { 
    hash as Hash, 
    compare as Compare,
    genSalt as GenerateSalt,
    verify as Verify,
    sign as Sign,
    createJwt as CreateJwt
}

