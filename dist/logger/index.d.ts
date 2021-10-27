import Log from "./log";
export interface LoggerInterface {
    write: (log: Log) => Promise<boolean>;
    create: () => Log;
}
export declare function create(): Log;
export declare function write(log?: Log): Promise<boolean>;
declare const _default: {
    write: typeof write;
    create: typeof create;
};
export default _default;
