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
    'SMTP_HOST': z.string(),
    'SMTP_PORT': z.number(),
    'SMTP_USE_TLS': z.boolean(),
    'SMTP_LOGIN': z.string(),
    'SMTP_PASSWORD': z.string(),
    'FROM_EMAIL': z.string().email(),  
    'SESSION_TOKEN_LENGTH': z.number(), 
    'JWT_SIGNATURE': z.string(),
    'JWT_SALT_LENGTH': z.number(), 
    'ROOT_DOMAIN': z.string(),
    'ROOT_PORT': z.number(), 
    'COOKIE_SIGNATURE' : z.string(), 
    'COOKIE_HTTPONLY': z.boolean(), 
    'COOKIE_SECURE': z.boolean(), 
    'COOKIE_PATH': z.string(),
    'SESSION_SIGNATURE': z.string(), 
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
        'SMTP_POOL':string,
        'SMTP_HOST': string,
        'SMTP_PORT':number,
        'SMTP_USE_TLS':boolean,
        'SMTP_LOGIN':string,
        'SMTP_PASSWORD':string,
        'JWT_SIGNATURE': string,
        'JWT_SALT_LENGTH': number, 
        'ROOT_DOMAIN': string,
        'ROOT_PORT': number,  
        'COOKIE_SIGNATURE': string,
        'COOKIE_HTTPONLY': boolean, 
        'COOKIE_SECURE': boolean, 
        'COOKIE_PATH': string, 
        'SESSION_SIGNATURE': string, 
        'SESSION_TOKEN_LENGTH': number, 
      }
    }
  }

const dotEnvPlugin = fp(async (server) => {
    server.register(fastifyEnv, options)
    await server.after()
})

export { dotEnvPlugin as DotEnvPlugin }


