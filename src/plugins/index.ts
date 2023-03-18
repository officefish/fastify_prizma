import { PrismaPlugin } from "./prisma-plugin"
import { MinCryptoPlugin } from "./hash-plugin"
import { JwtPlugin } from "./auth/jwt-plugin"
import { SwaggerPlugin } from "./swagger-plugin"
import { ShutdownPlugin } from "./shutdown"
import { MercuriusPlugin } from "./mercurius-plugin"
import { PothosPlugin } from "./pothos-plugin"
import { DotEnvPlugin } from "./dotenv-plugin"
import { CookiePlugin } from "./auth/cookie-plugin"

export { MinCrypto } from "./hash-plugin"

export default {
    DotEnvPlugin,
    PrismaPlugin,
    MinCryptoPlugin,
    JwtPlugin,
    CookiePlugin,
    SwaggerPlugin,
    ShutdownPlugin,
    PothosPlugin,
    MercuriusPlugin
}

