import fs, { WriteStream } from "fs"
import Log,{defaultLogger,LogInterface} from "./log"
import config from "../config"

export interface LoggerInterface{
    write:(log:Log)=>{},
    create:()=>Log
}
let logFile:WriteStream
const initLogVal:LogInterface = {
    ...defaultLogger,
    package: config.COMPANION_PKID,    
}

function initLogFile() {
    if (!logFile) {
        logFile = fs.createWriteStream(config.LOG_FILE, {flags:'a'})
    }
}
// this creates new log
export function create() {
    return new Log(initLogVal)
}
// this write the log
export async function write(log = new Log()): Promise<boolean>{
    try{
        initLogFile()
        const obj= log.toObject()
        if (!obj.error)
            console.log(obj.level, ":", obj.message)
        else 
            console.log(obj.level, ":", obj.message, ", ERROR = ", obj.error)
        const strl =log.toString() + "\n"
        //fs.appendFile(config.LOG_FILE, strl, () => {})
        //logFile.cork()
        logFile.write(strl)
        //process.nextTick(() => logFile.uncork());
        return true;
    }
    catch(e){
        return false;
    }

}

export default{
    write,
    create
}