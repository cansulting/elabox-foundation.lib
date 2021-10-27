"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.write = exports.create = void 0;
const fs_1 = __importDefault(require("fs"));
const log_1 = __importStar(require("./log"));
const config_1 = __importDefault(require("../config"));
let logFile;
const initLogVal = Object.assign(Object.assign({}, log_1.defaultLogger), { package: config_1.default.COMPANION_PKID });
function initLogFile() {
    if (!logFile) {
        logFile = fs_1.default.createWriteStream(config_1.default.LOG_FILE, { flags: 'a' });
    }
}
// this creates new log
function create() {
    return new log_1.default(initLogVal);
}
exports.create = create;
// this write the log
function write(log = new log_1.default()) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            initLogFile();
            const obj = log.toObject();
            if (!obj.error)
                console.log(obj.level, ":", obj.message);
            else
                console.log(obj.level, ":", obj.message, ", ERROR = ", obj.error);
            const strl = log.toString() + "\n";
            //fs.appendFile(config.LOG_FILE, strl, () => {})
            //logFile.cork()
            logFile.write(strl);
            //process.nextTick(() => logFile.uncork());
            return true;
        }
        catch (e) {
            return false;
        }
    });
}
exports.write = write;
exports.default = {
    write,
    create
};
