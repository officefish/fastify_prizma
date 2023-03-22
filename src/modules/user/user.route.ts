import { FastifyInstance } from "fastify"
import { $ref } from "./user.schema"

import {
    CreateUserHandler,
    GetCurrentUserHandler,
    GetUniqueUserHandler,
    DeleteCurrentUserHandler,
    DeleteUserHandler,
    GetNewPasswordHandler,
    ChangePasswordHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    DeleteUserSessionsHandler
} from './user.controller'

async function routes(server:FastifyInstance) {
    
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
    
    server.delete('/:email', {
        preHandler: [server.authenticate],
        schema: {
            description: 'Delete user with email ???',
            tags: ['user'],
        }
    }, DeleteUserHandler)
  
    /* User api associated with his password. */
    server.get('/reset/:email/:expires/:token', {
        schema: {
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

    //await server.after()
    server.log.info('User routes added.')
}

export { routes as UserRoutes } 