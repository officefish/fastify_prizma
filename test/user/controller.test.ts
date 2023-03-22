

"use strict"
import { describe, test, beforeAll, afterAll, expect, it, expectTypeOf } from 'vitest'
import supertest from 'supertest'
import {buildApp, AppOptions} from '../../src/app'

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
} from '../../src/modules/user/user.controller'


const options: AppOptions = { logger: false, }
const contentType = 'application/json; charset=utf-8'

describe('User controller handlers', () => {

    let app
    beforeAll(async () => {
        app = await buildApp(options)
    })

    it('User controller should contains handlers', async () => {
        expectTypeOf(CreateUserHandler).toBeFunction()
        expectTypeOf(GetCurrentUserHandler).toBeFunction()
        expectTypeOf(GetUniqueUserHandler).toBeFunction()
        expectTypeOf(DeleteCurrentUserHandler).toBeFunction()
        expectTypeOf(DeleteUserHandler).toBeFunction()
        expectTypeOf(GetNewPasswordHandler).toBeFunction()
        expectTypeOf(ChangePasswordHandler).toBeFunction()
        expectTypeOf(ForgotPasswordHandler).toBeFunction()
        expectTypeOf(ResetPasswordHandler).toBeFunction()
        expectTypeOf(DeleteUserSessionsHandler).toBeFunction()
    })

    afterAll(async () => {
        await app.close()
    })

})