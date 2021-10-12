"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EboxEvent_1 = __importDefault(require("../EboxEvent"));
describe("Event System", () => {
    var instance = new EboxEvent_1.default('http://localhost');
    instance.on('connect', () => {
        console.log("connected");
        it("subcribe", () => {
            instance.subscribe("app.testing");
            instance.onAction("testaction", (_arg) => {
                console.log(_arg);
            });
        });
        it("broadcast", () => {
        });
    });
    instance.on('error', (err) => {
        console.log("ERror", err);
    });
});
