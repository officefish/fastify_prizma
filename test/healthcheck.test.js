'use strict'

const tap = require('tap')
const supertest = require('supertest')
const { buildApp, buildEmpty, startApp } = require('../build/app')

const options = {
    logger: false,
}


tap.test('requests the GET "/healthcheck" route', async t => {

    const app = await buildEmpty()
    await startApp(app, '0.0.0.0', 3000)    
    
    t.teardown(() => app.close())

    await app.ready()
  
    const response = await supertest(app.server)
      .get('/healthcheck')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
    t.same(response.body, { status: 'ok' })
    
    app.close()
     
  })
  
    

    
    
// })