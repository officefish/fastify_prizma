import fastifyEnv from "@fastify/env"
import fp from 'fastify-plugin'

const schema = {
  type: 'object',
  required: [ 
    'DB_PASSWORD', 
    'DB_USERNAME',  
    'ACCESS_TOKEN_MINUTES',  
    'LINK_EXPIRE_MINUTES',  
    'REFRESH_TOKEN_DAYS',  
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_POOL',
    'SMTP_USE_TLS',
    'SMTP_LOGIN',
    'SMTP_PASSWORD',
    'SMTP_SENDER',
    'SMTP_SUBJECT', 
    'FROM_EMAIL',  
    'JWT_SIGNATURE',
    'JWT_SALT_LENGTH', 
    'ROOT_DOMAIN',
    'ROOT_PORT', 
    'COOKIE_SIGNATURE', 
    'COOKIE_HTTPONLY', 
    'COOKIE_SECURE', 
    'COOKIE_PATH',
    'SESSION_SIGNATURE',
    'SESSION_TOKEN_LENGTH', 
    'SESSION_MAX_AGE'
   
  ],
  properties: {
    DB_PASSWORD: {
      type: 'string'
    }, 
    DB_USERNAME: {
      type: 'string'
    },
    ACCESS_TOKEN_MINUTES: {
      type: 'number'
    },  
    LINK_EXPIRE_MINUTES: {
      type: 'number'
    },  
    REFRESH_TOKEN_DAYS: {
      type: 'number'
    },  
    SMTP_HOST: {
      type: 'string'
    },
    SMTP_PORT: {
      type: 'number'
    },
    SMTP_POOL: {
      type: 'boolean'
    },
    SMTP_USE_TLS: {
      type: 'boolean'
    },
    SMTP_LOGIN: {
      type: 'string'
    },
    SMTP_PASSWORD: {
      type: 'string'
    },
    FROM_EMAIL: {
      type: 'string'
    },   
    JWT_SIGNATURE: {
      type: 'string'
    },
    JWT_SALT_LENGTH: {
      type: 'number'
    }, 
    ROOT_DOMAIN: {
      type: 'string'
    },
    ROOT_PORT: {
      type: 'number'
    }, 
    COOKIE_SIGNATURE: {
      type: 'string'
    }, 
    COOKIE_HTTPONLY: {
      type: 'boolean'
    }, 
    COOKIE_SECURE: {
      type: 'boolean'
    }, 
    COOKIE_PATH: {
      type: 'string'
    },
    SESSION_SIGNATURE: {
      type: 'string'
    },
    SESSION_TOKEN_LENGTH: {
      type: 'number'
    }, 
    SESSION_MAX_AGE: {
      type: 'number'
    }, 
    SMTP_SENDER: {
      type: 'string'
    },
    SMTP_SUBJECT: {
      type: 'string'
    } 
  }
}

// const variables = {
//     'DB_PASSWORD': z.string(), 
//     'DB_USERNAME': z.string(), 
//     'ACCESS_TOKEN_MINUTES': z.number(),  
//     'LINK_EXPIRE_MINUTES': z.number(),  
//     'REFRESH_TOKEN_DAYS': z.number(),  
//     'SMTP_HOST': z.string(),
//     'SMTP_PORT': z.number(),
//     'SMTP_USE_TLS': z.boolean(),
//     'SMTP_LOGIN': z.string(),
//     'SMTP_PASSWORD': z.string(),
//     'FROM_EMAIL': z.string(),  
//     'SESSION_TOKEN_LENGTH': z.number(), 
//     'JWT_SIGNATURE': z.string(),
//     'JWT_SALT_LENGTH': z.number(), 
//     'ROOT_DOMAIN': z.string(),
//     'ROOT_PORT': z.number(), 
//     'COOKIE_SIGNATURE' : z.string(), 
//     'COOKIE_HTTPONLY': z.boolean(), 
//     'COOKIE_SECURE': z.boolean(), 
//     'COOKIE_PATH': z.string(),
//     'SESSION_SIGNATURE': z.string(), 
// } 



declare module 'fastify' {
    interface FastifyInstance {
      env: { // this should be same as the confKey in options
        'DB_PASSWORD': string, 
        'DB_USERNAME': string, 
        'ACCESS_TOKEN_MINUTES': number,  
        'LINK_EXPIRE_MINUTES': number,  
        'REFRESH_TOKEN_DAYS': number,  
        'FROM_EMAIL': string,  
        'SMTP_POOL':boolean,
        'SMTP_HOST': string,
        'SMTP_PORT':number,
        'SMTP_USE_TLS':boolean,
        'SMTP_LOGIN':string,
        'SMTP_PASSWORD':string,
        'SMTP_SENDER':string,
        'SMTP_SUBJECT': string,
        'JWT_SIGNATURE': string,
        'JWT_SALT_LENGTH': number, 
        'ROOT_DOMAIN': string,
        'ROOT_PORT': number,  
        'COOKIE_SIGNATURE': string,
        'COOKIE_HTTPONLY': boolean, 
        'COOKIE_SECURE': boolean, 
        'COOKIE_PATH': string, 
        'SESSION_SIGNATURE': string, 
        'SESSION_TOKEN_LENGTH': number, 
        'SESSION_MAX_AGE': number
      }
    }
  }

const dotEnvPlugin = fp(async (server) => {

    const options = {
        confKey: 'env',
        schema: schema,
        dotenv: true,
        data: process.env
    }

    server.register(fastifyEnv, options)
    .ready((err) => {
      if (err) console.error(err)  
    })
    
    //await server.after()
    server.log.info('DotEnv Plugin Installed.')
})

export { dotEnvPlugin as DotEnvPlugin }


