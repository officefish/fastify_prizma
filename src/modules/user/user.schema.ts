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
const name = { name: z.string() }
const id = { id: z.string() }

const createUserSchema = z.object({
    ...email,
    ...password,
    ...name,
})

const createUserResponseSchema = z.object({
    ...id,
    ...name,
    ...email,
})

const loginUserSchema = z.object({
    ...email,
    ...password,
})

const loginUserResponseSchema = z.object({
    accessToken: z.string(),
})

type CreateUserInput = z.infer<typeof createUserSchema>
type LoginInput = z.infer<typeof loginUserSchema>
export { CreateUserInput, LoginInput }

export const {schemas:UserSchemas, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginUserSchema,
    loginUserResponseSchema
}, {$id: 'UserSchema'})