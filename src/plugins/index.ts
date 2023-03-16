import { PrismaPlugin } from "./prisma-plugin"
import { MinCryptoPlugin } from "./hash-plugin"
import { AuthPlugin } from "./jwt/jwt-plugin"
import { SwaggerPlugin } from "./swagger-plugin"
import { ShutdownPlugin } from "./shutdown"
import { MercuriusPlugin } from "./mercurius-plugin"
import { PothosPlugin } from "./pothos-plugin"

export { MinCrypto } from "./hash-plugin"

export default {
    PrismaPlugin,
    MinCryptoPlugin,
    AuthPlugin,
    SwaggerPlugin,
    ShutdownPlugin,
    PothosPlugin,
    MercuriusPlugin
}

