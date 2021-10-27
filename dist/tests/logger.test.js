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
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const logger_1 = __importDefault(require("../logger"));
function testIfMessageCreated(stack, message, level, errorMessage) {
    if (errorMessage) {
        (0, chai_1.expect)(stack.log.error, errorMessage);
    }
    (0, chai_1.expect)(stack.log).includes.keys("package", "time", "category", "level", "message", "error");
    (0, chai_1.expect)(stack.log.message).equals(message);
    (0, chai_1.expect)(stack.log.level, level);
}
describe("Logger", () => {
    before(() => {
        sinon_1.default.stub(console, 'log'); // disable console.log
        sinon_1.default.stub(console, 'info'); // disable console.info
        sinon_1.default.stub(console, 'warn'); // disable console.warn
        sinon_1.default.stub(console, 'error'); // disable console.error
    });
    let syslog = logger_1.default;
    let stack = syslog.create().info("this is an info message").addStack();
    it("can create log", () => {
        stack = syslog.create();
        (0, chai_1.expect)(stack).includes.keys("log");
    });
    it("can create error message", () => {
        const message = "this is an error message";
        const errorMessage = "this is an error";
        const level = "error";
        stack = syslog.create().error(message, errorMessage).addStack();
        testIfMessageCreated(stack, message, level, errorMessage);
    });
    it("can create debug message", () => {
        const message = "this is debug message";
        const level = "debug";
        stack = syslog.create().debug(message).addStack();
        testIfMessageCreated(stack, message, level);
    });
    it("can create warn message", () => {
        const message = "this is warn message";
        const level = "warn";
        stack = syslog.create().debug(message).addStack();
        testIfMessageCreated(stack, message, level);
    });
    it("can create info message", () => {
        const message = "this is info message";
        const level = "info";
        stack = syslog.create().info(message).addStack();
        testIfMessageCreated(stack, message, level);
    });
    it("can write logs", () => __awaiter(void 0, void 0, void 0, function* () {
        const ableToWrite = yield syslog.write(stack);
        (0, chai_1.expect)(ableToWrite).equals(true);
    }));
});
