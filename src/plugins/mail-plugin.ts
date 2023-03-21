import fp from 'fastify-plugin'
import mail from 'fastify-mail'

const mailPlugin = fp(async (server) => {

    const pool = server.env.SMTP_POOL
    const host = server.env.SMTP_HOST
    const port = server.env.SMTP_PORT
    const secure = server.env.SMTP_USE_TLS
    const auth = {
        user: server.env.SMTP_LOGIN,
        pass: server.env.SMTP_PASSWORD
    }

    const transporter = {
        pool: pool,
        host: host,
        port: port,
        secure: secure, // use TLS
        auth: auth
    }
    
    server.register(mail, transporter)
    .ready((err) => {
        if (err) console.error(err)  
      })
      
    //await server.after()
    server.log.info('Mail Plugin Installed.')
})

export { mailPlugin as MailPlugin }