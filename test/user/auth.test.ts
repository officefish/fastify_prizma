"use strict"
import { describe, it, test, beforeAll, afterAll, expect, assertType } from 'vitest'
import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import {buildApp, AppOptions} from '../../src/app'

const options: AppOptions = { logger: false, }
const contentType = 'application/json; charset=utf-8'

import service from '../../src/services'
import userService from '../../src/modules/user/user.service'

let app: Awaited<ReturnType<typeof buildApp>>
let newUser: any

const authRoot = '/api/auth'
let crypto
let signature 

let accessToken 
let refreshToken

beforeAll(async () => { 
    app = await buildApp(options) 

    newUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
    /* Create new User */
    const response = await app.inject()
        .post('/api/users')
        .payload(newUser)

    accessToken = response.cookies.find((cokkie) => cokkie.name === 'access-token')?.value
    refreshToken = response.cookies.find((cokkie) => cokkie.name === 'refresh-token')?.value

    crypto = app.minCrypto
    signature = app.env.JWT_SIGNATURE    
})

afterAll(async () => { 
    //await app.after()
    await app.close() 
})

describe('Auth API', () => {

    it('GET /api/auth/verify/:email/:expires/:token should not verify user with overdue expires', async () => {

        const expires = Date.now().toString()
          
        const email = newUser.email
        const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')

        const encodedEmail = encodeURIComponent(email)
        const link =
             `${authRoot}/verify/` + `${encodedEmail}/${expires}/${emailToken}`

        const response = await app.inject()
            .get(link)
    
        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('error')

    })

    it(`GET /api/auth/login should login user if he is exist even if he is not verified`, async () => {
        const response = await app.inject()
            .post(`/api/auth/login`)
            .payload({...newUser})

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('verified')
        expect(response.json().verified).toBeFalsy()
        expect(response.json()).haveOwnProperty('access-token')
        
    })

    it(`GET /api/auth/verify/:email/:expires/:token should verify user with required expires`, async () => {

        const link_expires = app.env.LINK_EXPIRE_MINUTES
        const expires = service.NowPlusMinutes(link_expires).getTime().toString()
          
        const email = newUser.email
        const emailToken = await service.CreateJwt(crypto, {signature, email, expires}, ':')

        const encodedEmail = encodeURIComponent(email)
        const link =
             `${authRoot}/verify/` + `${encodedEmail}/${expires}/${emailToken}`

        const response = await app.inject()
            .get(link)
    
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('verified')
        expect(response.json().verified).toBeTruthy()
    })

    it(`GET /api/auth/login should login verified user`, async () => {
        const response = await app.inject()
            .post(`/api/auth/login`)
            .payload({...newUser})

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('verified')
        expect(response.json().verified).toBeTruthy()
        expect(response.json()).haveOwnProperty('access-token')
        
    })

    it(`GET /api/auth/ with no token should send error message`, async () => {
        const response = await app.inject()
            .get(`/api/auth/`)

        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('error')
    })

    it(`GET /api/auth/ with refresh token should authenticate user and send new tokens in cookies`, async () => {
        const response = await app.inject()
            .get(`/api/auth/`)
            .cookies({'refresh-token':refreshToken})

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)

        const newAccessToken = response.cookies.find((cokkie) => cokkie.name === 'access-token')?.value || ''
        const newRefreshToken = response.cookies.find((cokkie) => cokkie.name === 'refresh-token')?.value || ''
        
        expect(newAccessToken.length > 0).toBeTruthy()
        expect(newRefreshToken.length > 0).toBeTruthy()
    })

    it(`GET /api/auth/logout should clear tokens cookies`, async () => {
        const response = await app.inject()
            .get(`/api/auth/logout`)

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)

        const newAccessToken = response.cookies.find((cokkie) => cokkie.name === 'access-token')?.value || ''
        const newRefreshToken = response.cookies.find((cokkie) => cokkie.name === 'refresh-token')?.value || ''
        
        expect(newAccessToken.length > 0).toBeFalsy()
        expect(newRefreshToken.length > 0).toBeFalsy()
    })

})