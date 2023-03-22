'use strict'
import { describe, test, beforeAll, afterAll, expect, } from 'vitest'
import supertest from 'supertest'

import {buildApp, AppOptions} from '../src/app'

const mock = { status: 'ok' }
const options: AppOptions = { logger: false, }
const url = '/healthcheck'
const contentType = 'application/json; charset=utf-8'

describe('Application healthcheck', () => {

  let app
  beforeAll(async () => {
    app = await buildApp(options) // called once before all tests run
  })

  test('with HTTP injection', async () => {
    
    const response = await app.inject({
      method: 'GET',
      url: url,
    })
  
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe(contentType)
    expect(JSON.parse(response.payload)).instanceOf(Object)
    expect(JSON.parse(response.payload)).toStrictEqual(mock)
  })

  test('with a running server', async () => {
    await app.ready()
  
    const response = await supertest(app.server)
      .get(url)
      .expect(200)
      .expect('Content-Type', contentType)

    expect(response.body).instanceOf(Object)
    expect(response.body).toStrictEqual(mock)

  })

  afterAll(async () => {
    await app.close()
  })
  
})