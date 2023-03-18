import {z} from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const createUser = {
    email: z.string().email(),
    password: z.string().min(6),
}

const changePassword = {
    email: z.string().email(),
    oldPassword: z.string(),
    newPassword: z.string().min(6),
}

const createUserSchema = z.object({
    ...createUser,
})

const changedPasswordSchema = z.object({
    ...changePassword,
})

export type ChangePasswordInput = z.infer<typeof changedPasswordSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>