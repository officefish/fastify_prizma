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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
function routes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post('/', {
            schema: {
                body: (0, user_schema_1.$ref)('createUserSchema'),
                response: {
                    201: (0, user_schema_1.$ref)('createUserResponseSchema'),
                }
            },
        }, user_controller_1.RegisterUserHandler);
        server.post('/auth', {
            schema: {
                body: (0, user_schema_1.$ref)('loginUserSchema'),
                response: {
                    200: (0, user_schema_1.$ref)('loginUserResponseSchema'),
                }
            }
        }, user_controller_1.LoginUserHandler);
        server.get('/', {
            preHandler: [server.authenticate]
        }, user_controller_1.GetUsersHandler);
    });
}
exports.UserRoutes = routes;
