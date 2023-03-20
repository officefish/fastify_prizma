import {string, z} from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

import { FastifyReply } from "fastify/types/reply"
import { FastifyRequest } from "fastify/types/request"
import { CookieOptions } from '@fastify/session'

const createUser = {
    email: z.string().email(),
    password: z.string().min(6),
}

const changePassword = {
    email: z.string().email(),
    oldPassword: z.string(),
    newPassword: z.string().min(6),
}

const minimumUserSchema = z.object({
    ...createUser,
})

const changedPasswordSchema = z.object({
    ...changePassword,
})

export type ChangePasswordInput = z.infer<typeof changedPasswordSchema>
export type CreateUserInput = z.infer<typeof minimumUserSchema>
export type LoginInput = z.infer<typeof minimumUserSchema>

const minimumSession = {
    token: z.string().min(32),
    userId: z.string()
}

const newSession = {
    ...minimumSession,
    userAgent: z.string(),
    valid: z.boolean().optional()
}

const newSessionSchema = z.object({...newSession})
export type NewSessionInput = z.infer<typeof newSessionSchema >

export type CreateTokensInput = {
    userId: string, 
    sessionToken: string, 
    request: FastifyRequest, 
    reply: FastifyReply
}

export type CreateCookieInput = {
    reply:FastifyReply, 
    name:string, 
    value:string, 
    options:CookieOptions,
}

export type SendVerifyEmailInput = {
    email: string,
    domain: string,
    expires: number
}

