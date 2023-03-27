import { buildJsonSchemas } from 'fastify-zod'
import {z} from 'zod'

import { Role } from '@prisma/client'

const roleEnum = z.nativeEnum(Role)


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

const resetPassword = {
    ...email,
    ...password,
    token: z.string(),
    expires: z.string()
}

const newPassword = {
    ...email,
    token: z.string(),
    expires: z.string()
}

const manyUsers = {
    skip: z.number(),
    take: z.number()
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

const forgotPasswordSchema = z.object({
    ...email
})

const resetPasswordSchema = z.object({
    ...resetPassword
})

const newPasswordSchema = z.object({
    ...newPassword
})

const manyUsersSchema = z.object({
    ...manyUsers
})

const updateRoleSchema = z.object({
    ...email,
    role:roleEnum.optional()
})

type CreateUserInput = z.infer<typeof createUserSchema>
type UniqueUserInput = z.infer<typeof uniqueUserSchema>
type ManyUsersInput = z.infer<typeof manyUsersSchema>
type ChangePasswordInput = z.infer<typeof changedPasswordSchema>
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
type NewPasswordInput = z.infer<typeof newPasswordSchema>
type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
type UpdateRoleInput = z.infer<typeof updateRoleSchema>

export { 
    CreateUserInput, 
    UniqueUserInput,
    ManyUsersInput,
    ChangePasswordInput,
    ForgotPasswordInput,
    NewPasswordInput,
    ResetPasswordInput,
    UpdateRoleInput
}

export const {schemas:UserSchemas, $ref} = buildJsonSchemas({
    createUserSchema,
    uniqueUserSchema,
    userResponseSchema,
    manyUsersSchema,
    forgotPasswordSchema,
    newPasswordSchema,
    changedPasswordSchema,
    resetPasswordSchema,
    updateRoleSchema
}, {$id: 'UserSchema'})