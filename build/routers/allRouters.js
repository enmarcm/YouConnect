"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./authRouter"));
const contactRouter_1 = __importDefault(require("./contactRouter"));
const groupRouter_1 = __importDefault(require("./groupRouter"));
const mainRouter_1 = __importDefault(require("./mainRouter"));
const profileRouter_1 = __importDefault(require("./profileRouter"));
exports.default = {
    authRouter: authRouter_1.default,
    contactRouter: contactRouter_1.default,
    groupRouter: groupRouter_1.default,
    mainRouter: mainRouter_1.default,
    profileRouter: profileRouter_1.default,
};
