"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = void 0;
exports.defaultLogger = {
    package: "",
    time: "",
    category: "",
    level: "",
    message: "",
    error: ""
};
/**
 * Class that facilitates Logger.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions,
 * you must first need to register to that specific package.
 */
class Log {
    constructor(initialValue = exports.defaultLogger) {
        this.log = initialValue;
    }
    toObject() {
        return this.log;
    }
    toString() {
        return JSON.stringify(this.log);
    }
    addProperty(key = "", value) {
        this.log[key] = value;
        return this;
    }
    addCategory(category = "") {
        return this.addProperty("category", category);
    }
    addPackage(pkg = "") {
        return this.addProperty("package", pkg);
    }
    addStack() {
        const err = this.log["error"];
        if (err !== null &&
            typeof (err) === typeof (new Error())) {
            this.addProperty("stack", err);
        }
        return this;
    }
    addCaller() {
        var e = new Error();
        if (!e.stack) {
            try {
                // IE requires the Error to actually be thrown or else the 
                // Error's 'stack' property is undefined.
                throw e;
            }
            catch (e) {
                if (!e.stack) {
                    //return 0; // IE < 10, likely
                }
            }
        }
        if (e.stack) {
            let stack = e.stack.toString().split(/\r\n|\n/);
            this.addProperty("caller", stack[2]);
        }
        return this;
    }
    _addLevel(msg, level) {
        this.addProperty("level", level);
        const date = new Date(Date.now());
        const isoDate = date.toISOString();
        this.addProperty("time", isoDate);
        if (msg != "")
            this.addProperty("message", msg);
        return this;
    }
    debug(msg = "") {
        return this._addLevel(msg, "debug");
    }
    error(msg = "", err) {
        this._addLevel(msg, "error");
        if (err != null)
            this.addProperty("error", err);
        return this;
    }
    warn(msg = "") {
        return this._addLevel(msg, "warn");
    }
    info(msg = "") {
        return this._addLevel(msg, "info");
    }
}
exports.default = Log;
