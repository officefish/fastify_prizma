import fastifyEnv from "@fastify/env"
import fp from 'fastify-plugin'

import { buildJsonSchemas } from 'fastify-zod'
import {z} from 'zod'

const variables = {
    'DB_PASSWORD': z.string(), 
    'DB_USERNAME': z.string(), 
    'ACCESS_TOKEN_MINUTES': z.number(),  
    'LINK_EXPIRE_MINUTES': z.number(),  
    'REFRESH_TOKEN_DAYS': z.number(),  
    'FROM_EMAIL': z.string().email(),  
    'SESSION_TOKEN_LENGTH': z.number(), 
    'JWT_SIGNATURE': z.string(),
    'JWT_SALT_LENGTH': z.number(), 
    'ROOT_DOMAIN': z.string(), 
    'COOKIE_HTTPONLY': z.boolean(), 
    'COOKIE_SECURE': z.boolean(), 
    'COOKIE_PATH': z.string(), 
} 

const schema = z.object({
    ...variables,
}) 

const {schemas:DotEnvSchema, $ref} = buildJsonSchemas({
    schema,
}, {$id: 'DotEnvSchema'})

const options = {
    confKey: 'env',
    schema: $ref('schema'),
    dotenv: true,
    data: process.env
}

declare module 'fastify' {
    interface FastifyInstance {
      env: { // this should be same as the confKey in options
        'DB_PASSWORD': string, 
        'DB_USERNAME': string, 
        'ACCESS_TOKEN_MINUTES': number,  
        'LINK_EXPIRE_MINUTES': number,  
        'REFRESH_TOKEN_DAYS': number,  
        'FROM_EMAIL': string,  
        'SESSION_TOKEN_LENGTH': number, 
        'JWT_SIGNATURE': string,
        'JWT_SALT_LENGTH': number, 
        'ROOT_DOMAIN': string, 
        'COOKIE_HTTPONLY': boolean, 
        'COOKIE_SECURE': boolean, 
        'COOKIE_PATH': string, 
      }
    }
  }

const dotEnvPlugin = fp(async (server) => {
    server.register(fastifyEnv, options)
    await server.after()
})

export { dotEnvPlugin as DotEnvPlugin }


