"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const functions_1 = require("./functions");
const middlewares_1 = require("./middlewares/middlewares");
const allRouters_1 = __importDefault(require("./routers/allRouters"));
const enums_1 = require("./enums");
const app = (0, express_1.default)();
//{ Middlewares
app.use((0, middlewares_1.midJson)());
app.use(middlewares_1.midValidJson);
app.use((0, middlewares_1.midCors)());
app.use(middlewares_1.midNotJson);
app.use(middlewares_1.midConnectDB);
//{ Routes
app.use(enums_1.Routes.MAIN, allRouters_1.default.mainRouter);
app.use(enums_1.Routes.AUTH, allRouters_1.default.authRouter);
app.use(middlewares_1.midToken);
app.use(enums_1.Routes.CONTACT, middlewares_1.midToken, allRouters_1.default.contactRouter);
app.use(enums_1.Routes.GROUP, middlewares_1.midToken, allRouters_1.default.groupRouter);
app.use(enums_1.Routes.PROFILE, middlewares_1.midToken, allRouters_1.default.profileRouter);
app.use(middlewares_1.midErrorHandler);
app.use(middlewares_1.midNotFound);
(0, functions_1.startServer)({ app, PORT: constants_1.PORT });
