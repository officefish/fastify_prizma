"use strict"
import { describe, it, test, beforeAll, afterAll, expect, } from 'vitest'
import supertest from 'supertest'
import {buildApp, AppOptions} from '../../src/app'

const options: AppOptions = { logger: false, }
const contentType = 'application/json; charset=utf-8'

describe('Create User API', () => {

    let app
    beforeAll(async () => {
        app = await buildApp(options)
    })

    it('should response error for empty body request', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/users',
        })

        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toBe(contentType)
        expect(response.json()).instanceOf(Object)
        expect(response.json()).haveOwnProperty('error')
        expect(response.json()).haveOwnProperty('message')
    })

    afterAll(async () => {
        await app.close()
    })

})