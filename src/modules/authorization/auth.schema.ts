import {z} from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { CookieOptions } from '@fastify/session'

const email = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    }).email()
}
const password = {
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    })
}
//const name = { name: z.string().optional() }
//const id = { id: z.string() }

const loginUserSchema = z.object({
    ...email,
    ...password,
})
const loginUserResponseSchema = z.object({
    accessToken: z.string(),
})

const verifyUserSchema = z.object({
    ...email,
    expires: z.string(),
    token: z.string()
})

type LoginInput = z.infer<typeof loginUserSchema>
type VerifyUserInput = z.infer<typeof verifyUserSchema>

type CreateTokensInput = {
    userId: string, 
    sessionToken: string, 
    request: FastifyRequest, 
    reply: FastifyReply
}

type CreateCookieInput = {
    reply:FastifyReply, 
    name:string, 
    value:string, 
    options:CookieOptions,
}

type SendVerifyEmailInput = {
    email: string,
    domain: string,
    expires: number
}

export { 
    LoginInput,
    VerifyUserInput,
    CreateCookieInput,
    CreateTokensInput,
    SendVerifyEmailInput
}

export const {schemas:AuthSchemas, $ref} = buildJsonSchemas({
    loginUserSchema,
    verifyUserSchema,
    loginUserResponseSchema,
}, {$id: 'AuthSchema'})


