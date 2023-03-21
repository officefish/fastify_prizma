import { buildJsonSchemas } from 'fastify-zod'
import {z} from 'zod'

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
const name = { name: z.string().optional() }
const id = { id: z.string() }

const changePassword = {
    ...email,
    oldPassword: z.string(),
    newPassword: z.string().min(6),
}

const uniqueUser = {
    email: z.string().email().optional(),
    id: z.string().optional()
}
const uniqueUserSchema = z.object({
    ...uniqueUser
})

const createUserSchema = z.object({
    ...email,
    ...password,
    ...name,
})
const userResponseSchema = z.object({
    ...id,
    ...name,
    ...email,
})

const changedPasswordSchema = z.object({
    ...changePassword,
})

type ChangePasswordInput = z.infer<typeof changedPasswordSchema>
type CreateUserInput = z.infer<typeof createUserSchema>
type UniqueUserInput = z.infer<typeof uniqueUserSchema>

export { 
    CreateUserInput, 
    ChangePasswordInput,
    UniqueUserInput
}

export const {schemas:UserSchemas, $ref} = buildJsonSchemas({
    createUserSchema,
    uniqueUserSchema,
    userResponseSchema,
    changedPasswordSchema
}, {$id: 'UserSchema'})