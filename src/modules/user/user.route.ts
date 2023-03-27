import { FastifyInstance } from "fastify"
import { $ref } from "./user.schema"

import {
    CreateUserHandler,
    GetCurrentUserHandler,
    GetUniqueUserHandler,
    GetManyUsersHandler,
    DeleteCurrentUserHandler,
    DeleteUserHandler,
    GetNewPasswordHandler,
    ChangePasswordHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    DeleteUserSessionsHandler,
    IsAdminHandler,
    IsPablisherHandler,
    IsDeveloperHandler,
    IsMemberHandler,
    UpdateRoleHandler
} from './user.controller'
import zodToJsonSchema from "zod-to-json-schema"

declare module 'fastify' {
   
    interface FastifyInstance {
        admin: any,
        publisher: any,
        developer: any,
        member: any
    }
}

async function routes(server:FastifyInstance) {

    /* User Role decorators */
    server.decorate('admin', IsAdminHandler)
    server.decorate('publisher', IsPablisherHandler)
    server.decorate('developer', IsDeveloperHandler)
    server.decorate('member', IsMemberHandler)
    
    /* User api. Seems it should be in user module. */
    server.post('/', {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                 201: $ref('userResponseSchema'),
            },
            description: 'Create new User.',
            tags: ['user'],
        }
      }, CreateUserHandler)

    server.get('/', {
        preHandler: [server.authenticate],
        schema: {
            params: $ref('manyUsersSchema'),
            description: 'Get many users minimum data',
            tags: ['user'],
        }
    }, GetManyUsersHandler)
      
    server.get('/current', {
        preHandler: [server.authenticate],
        schema: {
            response: {
                201: $ref('userResponseSchema'),
            },  
            description: 'Get user minimum auth data.',
            tags: ['user'],
        }
    }, GetCurrentUserHandler)

    server.post('/unique', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('uniqueUserSchema'),
            response: {
                201: $ref('userResponseSchema'),
            },  
            description: 'Get user minimum auth data.',
            tags: ['user'],
        }
    }, GetUniqueUserHandler)
  
    server.delete('/', {
        preHandler: [server.authenticate],
        schema: {
            description: 'Delete authorized user.',
            tags: ['user'],
        }
    }, DeleteCurrentUserHandler)
    
    server.delete('/:email/:id', {
        preHandler: [server.admin],
        schema: {
            params: $ref('uniqueUserSchema'),
            description: 'Delete user with email. Admin Role required.',
            tags: ['user'],
        }
    }, DeleteUserHandler)
  
    /* User api related with password. */
    server.get('/reset/:email/:expires/:token', {
        schema: {
            params: $ref('newPasswordSchema'),
            description: 'Get user password with token???',
            tags: ['password'],
        }
    }, GetNewPasswordHandler)

    server.post('/password', {
        preHandler: [server.authenticate],
        schema: {
            description: 'Change user password',
            tags: ['password'],
        }
    }, ChangePasswordHandler)

    server.get('/forgot-password/:email', {
        preHandler: [server.authenticate],
        schema: {
            description: 'Forgot password ???',
            tags: ['password'],
        }
    }, ForgotPasswordHandler)

    server.post('/reset', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('resetPasswordSchema'),
            description: 'Reset User password.',
            tags: ['password'],
        }
    }, ResetPasswordHandler)

    /* User session related endpoints */  
    server.delete('/:email/sessions', {
        preHandler: [server.authenticate],
        schema: {
            description: 'Delete related User session.',
            tags: ['session'],
        }
    }, DeleteUserSessionsHandler)

    server.put('/role', {
        preHandler: [server.admin],
        schema: {
            body: $ref('updateRoleSchema'),
            description: 'Update User role.',
            tags: ['user','role'],
        }
    }, UpdateRoleHandler)

    //await server.after()
    server.log.info('User routes added.')
}

export { routes as UserRoutes } 