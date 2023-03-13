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
const app_1 = require("./app");
const mock_service_1 = require("./services/mock.service");
const options = {
    logger: true,
};
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield (0, app_1.buildApp)(options);
    app.get('/healthcheck', function () {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: 'ok' };
        });
    });
    try {
        yield app.listen({
            port: 8001,
            host: '0.0.0.0',
        });
        yield (0, mock_service_1.mock)(app.prisma);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
start();
