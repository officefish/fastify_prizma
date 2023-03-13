import crypto from 'crypto'
import fp from 'fastify-plugin'


interface MinCrypto {
    hashPassword(password: string): void
    verifyPassword({candidatePassword, salt, hash}:{
        candidatePassword: string,
        salt: string,
        hash: string
    }) : boolean
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
}

declare module 'fastify' {
    interface FastifyInstance {
        minCrypto: MinCrypto
    }
}

const minCryptoPlugin = fp(async (server) => {
    const minCrypto = await new MinCrypto()
    server.decorate('minCrypto', minCrypto)
    // server.addHook('onClose', async () =>  {
    //     server.minCrypto.hashPassword('someStr')
    // })
})

export { minCryptoPlugin as MinCryptoPlugin, MinCrypto }





