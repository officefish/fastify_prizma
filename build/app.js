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
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const plugins_1 = __importDefault(require("./plugins"));
const user_route_1 = require("./modules/user/user.route");
const user_schema_1 = require("./modules/user/user.schema");
function buildApp(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const fastify = (0, fastify_1.default)(options);
        for (const schema of user_schema_1.UserSchemas) {
            fastify.addSchema(schema);
        }
        fastify.register(plugins_1.default.PrismaPlugin);
        fastify.register(plugins_1.default.MinCryptoPlugin);
        fastify.register(user_route_1.UserRoutes, { prefix: 'api/users' });
        return fastify;
    });
}
exports.buildApp = buildApp;
