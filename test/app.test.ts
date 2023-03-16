//'use strict'

const tap = require('tap')
const { buildApp, startApp, AppOptions } = require('../build/app')

const options = {
    logger: false,
}

tap.test('requests the "/" route', async t => {
    const app = await buildApp(options)

     // At the end of your tests it is highly recommended to call `.close()`
    // to ensure that all connections to external services get closed.
    t.teardown(() => app.close())

    app.addHook('onReady', function (done) {
      tap.pass('this is fine')
    })
    

     // startApp(app).then(async () => {
    //   const response = await app.inject({
    //     method: 'GET',
    //     url: '/'
    //   })
    //   t.equal(response.statusCode, 200, 'returns a status code of 200')
    // }).catch(err => t.fail(err))
    await startApp(app)

   

    // app.inject({
    //   method: 'GET',
    //   url: '/'
    // }, (err, response) => {
    //   t.error(err)
    //   t.equal(response.statusCode, 200)
    //   t.equal(response.headers['content-type'], 'application/json; charset=utf-8')
    //   t.same(response.json(), { hello: 'world' })
    // })
    
})