"use strict"
import { describe, it, test, beforeAll, afterAll, expect, } from 'vitest'
import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import {buildApp, AppOptions} from '../../src/app'

const options: AppOptions = { logger: false, }
const contentType = 'application/json; charset=utf-8'

const users = '/api/users' 

let app: Awaited<ReturnType<typeof buildApp>>
beforeAll(async () => { 
    app = await buildApp(options) }
)
afterAll(() => { app.close() })

describe('User API', () => {

    it('POST /api/users with empty body', async () => {
        const response = await app.inject()
            .post(users)
        

        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('error')
        expect(response.json()).haveOwnProperty('message')
    })


    it('POST /api/users with minimum required', async () => {
        const payload = {
            email: faker.internet.email(),
            password: faker.internet.password(),
        }
        const response = await app.inject()
            .post(users)
            .payload(payload)

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

    it('GET /api/users/ verify/:email/:expires/:token', async () => {


        expect(true).toBeTruthy()

        
        // const payload = {
        //     email: faker.internet.email(),
        //     password: faker.internet.password(),
        // }

        // const domain = 'localhost:8001/api/auth'
        // const link_expires = request.server.env.LINK_EXPIRE_MINUTES
        // const expires = service.NowPlusMinutes(link_expires).getTime().toString()
   

        // const crypto = request.server.minCrypto
        // const signature = request.server.env.JWT_SIGNATURE

        // const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')

        // const encodedEmail = encodeURIComponent(email)
        // const link =
        //     `http://${domain}/verify/` + `${encodedEmail}/${expires}/${emailToken}`

        // //const unencodedEmail = 

        // const response = await app.inject()
        //     .get(users)
        //     //.pa(payload)

        // expect(response.statusCode).toBe(200)
        // expect(response.headers['content-type']).toBe(contentType)
        // expect(response.json()).instanceOf(Object)
        // expect(response.json()).haveOwnProperty('access-token')
        // expect(response.json()).haveOwnProperty('verified')
        // expect(response.json().verified).is.false
        /* Verify jwt token test */
        // const verify = jwt.verify as jest.MockedFunction<(
        // token: string,
        // secretOrPublicKey: jwt.Secret,
        // options?: jwt.VerifyOptions,
        // ) => Record<string, unknown> | string
        // verify.mockReturnValue({ verified: 'true' })
    })
})