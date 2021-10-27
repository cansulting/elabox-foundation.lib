export interface LogInterface {
    [key: string]: any;
    package: string;
    time: string;
    category: string;
    level: string;
    message: string;
    error: string;
}
export declare const defaultLogger: {
    package: string;
    time: string;
    category: string;
    level: string;
    message: string;
    error: string;
};
/**
 * Class that facilitates Logger.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions,
 * you must first need to register to that specific package.
 */
declare class Log {
    log: LogInterface;
    constructor(initialValue?: LogInterface);
    toObject(): LogInterface;
    toString(): string;
    addProperty(key: string | undefined, value: string): Log;
    addCategory(category?: string): Log;
    addPackage(pkg?: string): Log;
    addStack(): Log;
    addCaller(): Log;
    _addLevel(msg: string, level: string): Log;
    debug(msg?: string): Log;
    error(msg: string | undefined, err: string): Log;
    warn(msg?: string): Log;
    info(msg?: string): Log;
}
export default Log;
