"use strict"
import { describe, it, test, beforeAll, afterAll, expect, } from 'vitest'
import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import {buildApp, AppOptions} from '../../src/app'

const options: AppOptions = { logger: false, }
const contentType = 'application/json; charset=utf-8'
 

let app: Awaited<ReturnType<typeof buildApp>>
let newUser: any
beforeAll(async () => { 
    app = await buildApp(options) 

    newUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
})

afterAll(async () => { 
    //await app.after()
    await app.close() 
})

describe('User API', () => {

    it('POST /api/users with empty body should response code: 400', async () => {
        const response = await app.inject()
            .post('/api/users')
        
        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('error')
        expect(response.json()).haveOwnProperty('message')
    })


    it('POST /api/users with minimum required should create new user', async () => {
        
        const response = await app.inject()
            .post('/api/users')
            .payload(newUser)

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('access-token')
        expect(response.json()).haveOwnProperty('verified')
        expect(response.json().verified).is.false
        /* Verify jwt token test */
        // const verify = jwt.verify as jest.MockedFunction<(
        // token: string,
        // secretOrPublicKey: jwt.Secret,
        // options?: jwt.VerifyOptions,
        // ) => Record<string, unknown> | string
        // verify.mockReturnValue({ verified: 'true' })
    })

  
})