
export interface LogInterface
{ 
    [key: string]: any,
    package: string
    time: string,//log time
    category: string, //log category
    level: string, // log level
    message: string, //log message
    error: string //log error    
}
export const defaultLogger={
    package:"",    
    time:"",
    category:"",
    level:"",
    message:"",
    error:""
}
/**
 * Class that facilitates Logger.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions, 
 * you must first need to register to that specific package.
 */
class Log{
    log:LogInterface
    constructor(initialValue:LogInterface=defaultLogger) {
        this.log = initialValue
    }    
    toObject():LogInterface{
        return this.log;
    }
    toString(): string {
        return JSON.stringify(this.log)
    }    
    addProperty(key:string = "", value:string):Log {
        this.log[key] = value
        return this
    }    
    addCategory(category:string = ""):Log{
        return this.addProperty("category", category)
    }    
    addPackage(pkg:string = ""):Log {
        return this.addProperty("package", pkg)
    }    
    addStack():Log {
        const err = this.log["error"] 
        if (err !== null && 
            typeof( err) === typeof(new Error())) {
            this.addProperty("stack", err)
        }
        return this
    }    
    addCaller():Log {
        var e:Error = new Error();
        if (!e.stack) {
            try {
                // IE requires the Error to actually be thrown or else the 
                // Error's 'stack' property is undefined.
                throw e;
            } catch (e:any) {
                if (!e.stack) {
                    //return 0; // IE < 10, likely
                }
            }
        }
        if(e.stack){
            let stack=e.stack.toString().split(/\r\n|\n/);
            this.addProperty("caller", stack[2]);       
        }
        return this
    }    
    _addLevel(msg:string, level:string):Log {
        this.addProperty("level", level)
        const date:Date = new Date( Date.now())
        const isoDate:string = date.toISOString()
        this.addProperty("time", isoDate)
        if (msg != "")
            this.addProperty("message", msg)
        return this
    }    
    debug(msg:string = ""):Log {
        return this._addLevel(msg, "debug")
    }   
    error(msg:string = "", err:string):Log {
        this._addLevel(msg, "error")
        if (err != null)
            this.addProperty("error", err)
        return this
    }     
    warn(msg:string = ""):Log {
        return this._addLevel(msg, "warn")
    }    
    info(msg:string = ""):Log {
        return this._addLevel(msg, "info")
    }    
}

export default Log