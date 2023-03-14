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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersHandler = exports.LoginUserHandler = exports.RegisterUserHandler = void 0;
const user_service_1 = require("./user.service");
function register(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body, server } = request;
        try {
            const user = yield (0, user_service_1.CreateUserService)(server.prisma, server.minCrypto, body);
            return reply.code(201).send(user);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.RegisterUserHandler = register;
function login(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body, server } = request;
        const user = yield (0, user_service_1.FindUserByEmailService)(server.prisma, body.email);
        if (!user) {
            return reply.code(404).send({ message: "User not found." });
        }
        const correctPassword = yield (0, user_service_1.VerifyPasswordService)(server.minCrypto, {
            candidatePassword: body.password,
            salt: user.salt,
            hash: user.password
        });
        if (correctPassword) {
            const { password, salt } = user, rest = __rest(user, ["password", "salt"]);
            const accessToken = request.server.jwt.sign(rest);
            return reply.code(200).send({ accessToken: accessToken });
        }
        return reply.code(401).send({ message: "Incorrect password." });
    });
}
exports.LoginUserHandler = login;
function getUsers(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = request.server;
        const users = yield (0, user_service_1.FindUsersService)(server.prisma);
        if (users) {
            return reply.code(200).send(Object.assign({}, users));
        }
        return reply.code(401).send({ message: "No users found" });
    });
}
exports.GetUsersHandler = getUsers;
