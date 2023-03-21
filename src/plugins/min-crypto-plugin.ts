import crypto from 'crypto'
import fp from 'fastify-plugin'

import bcrypt from 'bcryptjs'
const {compare, genSalt, hash } = bcrypt

type JwtOptions = {
    signature: string,
    email: string,
    expires: string
}

interface MinCrypto {
    hashPassword(password: string): void
    verifyPassword({candidatePassword, salt, hash}:{
        candidatePassword: string,
        salt: string,
        hash: string
    }) : boolean
    sha1(input: string) :string
    createJwt(data: JwtOptions, separator: string) :string
}

class MinCrypto implements MinCrypto {

    hashPassword(password: string) {
        const salt = crypto.randomBytes(16).toString('hex')
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64,'sha512')
            .toString('hex')
        return {hash, salt}
    }
    
    verifyPassword({candidatePassword, salt, hash}:{
        candidatePassword: string,
        salt: string,
        hash: string
    }) {
        const candidateHash = crypto.pbkdf2Sync(candidatePassword, salt, 10000, 64, 'sha512')
            .toString('hex')
        return candidateHash === hash
    }
    
    sha1 (input: string) {
        return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
    }

    createJwt(data: JwtOptions, separator: string) {
        return crypto
          .createHash('sha256')
          .update(Object.values(data).join(separator))
          .digest('hex')
      }

}

interface Bcrypt {
    hash(payload:string, salt:string) : string
    compare(payload1: string, payload2: string) : boolean
    genSalt(length:number) : string
}

declare module 'fastify' {
    interface FastifyInstance {
        minCrypto: MinCrypto,
        bcrypt: Bcrypt
    }
}

const minCryptoPlugin = fp(async (server) => {
    const minCrypto = await new MinCrypto()
    server.decorate('bcrypt', { hash, compare, genSalt })
    server.decorate('minCrypto', minCrypto)
    
    //await server.after()
    
    server.log.info('MinCrypto Plugin Installed.')
})

export { 
    minCryptoPlugin as MinCryptoPlugin,
    Bcrypt,
    JwtOptions, 
    MinCrypto }





