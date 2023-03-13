import { buildJsonSchemas } from 'fastify-zod'
import {z} from 'zod'

const useCore = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    }).email(),
    name: z.string(),
}

const createUserSchema = z.object({
    ...useCore,
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    })
})

const createUserResponseSchema = z.object({
    id: z.string(),
    ...useCore,
})

type CreateUserInput = z.infer<typeof createUserSchema>
export { CreateUserInput }

export const {schemas:UserSchemas, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema
})