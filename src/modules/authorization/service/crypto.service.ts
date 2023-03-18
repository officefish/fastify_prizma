import { Bcrypt } from "../../../plugins/hash-plugin"

async function hash (crypto:Bcrypt, payload:string, salt:string)  {
    return await crypto.hash(payload, salt)
}

async function compare (crypto:Bcrypt, payload1:string, payload2:string) {
    return await crypto.compare(payload1, payload2)
}

async function genSalt (ctypto:Bcrypt, length:number) {
    return await ctypto.genSalt(length)
}

export { 
    hash as MakeHash, 
    compare as Compare,
    genSalt as GenerateSalt
}

