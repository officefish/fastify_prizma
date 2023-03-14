import { PrismaPlugin } from "./prisma-plugin"
import { MinCryptoPlugin } from "./hash-plugin"
import { AuthPlugin } from "./jwt/jwt-plugin"
import { SwaggerPlugin } from "./swagger-plugin"

export { MinCrypto } from "./hash-plugin"

export default {
    PrismaPlugin,
    MinCryptoPlugin,
    AuthPlugin,
    SwaggerPlugin
}
