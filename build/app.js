"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const plugins_1 = __importDefault(require("./plugins"));
const user_route_1 = require("./modules/user/user.route");
const user_schema_1 = require("./modules/user/user.schema");
const product_route_1 = require("./modules/product/product.route");
const product_schema_1 = require("./modules/product/product.schema");
const post_query_1 = require("./modules/post/post.query");
const user_query_1 = require("./modules/user/user.query");
const product_query_1 = require("./modules/product/product.query");
function buildApp(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const fastify = (0, fastify_1.default)(options);
        for (const schema of [...user_schema_1.UserSchemas, ...product_schema_1.ProductSchemas]) {
            fastify.addSchema(schema);
        }
        fastify.register(plugins_1.default.ShutdownPlugin);
        fastify.register(plugins_1.default.AuthPlugin);
        fastify.register(plugins_1.default.PrismaPlugin);
        fastify.register(plugins_1.default.MinCryptoPlugin);
        fastify.register(plugins_1.default.SwaggerPlugin);
        fastify.register(plugins_1.default.PothosPlugin);
        /* Here we should register all gql query fields */
        fastify.register(user_query_1.BuildUserQuery);
        fastify.register(post_query_1.BuildPostQuery);
        fastify.register(product_query_1.BuildProductQuery);
        fastify.register(plugins_1.default.MercuriusPlugin);
        fastify.register(user_route_1.UserRoutes, { prefix: 'api/users' });
        fastify.register(product_route_1.ProductRoutes, { prefix: 'api/products' });
        return fastify;
    });
}
exports.buildApp = buildApp;
function startApp(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/healthcheck', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return { status: 'ok' };
            });
        });
        try {
            yield server.listen({
                port: 8001,
                host: '0.0.0.0',
            });
        }
        catch (err) {
            server.log.error(err);
            process.exit(1);
        }
    });
}
exports.startApp = startApp;
