import {z} from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const changePassword = {
    email: z.string(),
    oldPassword: z.string(),
    newPassword: z.string(),
}

const changedPasswordSchema = z.object({
    ...changePassword,
})

export type ChangePasswordInput = z.infer<typeof changedPasswordSchema>