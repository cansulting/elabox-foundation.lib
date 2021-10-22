import { expect, assert } from 'chai'
import sinon from "sinon"
import Log,{LogInterface} from "../logger/log"
import Logger,{LoggerInterface} from "../logger"
interface StackInterface{
    log:LogInterface
}
function testIfMessageCreated(stack:StackInterface,message:string,level:string,errorMessage?:string){
    if(errorMessage){
        expect(stack.log.error,errorMessage)        
    }
    expect(stack.log).includes.keys("package","time","category","level","message","error")  
    expect(stack.log.message).equals(message)
    expect(stack.log.level,level)    
}
describe("Logger",()=>{
    before(() => {
        sinon.stub(console, 'log')  // disable console.log
        sinon.stub(console, 'info')  // disable console.info
        sinon.stub(console, 'warn')  // disable console.warn
        sinon.stub(console, 'error')  // disable console.error
    })    
    let syslog:LoggerInterface=Logger
    let stack:Log = syslog.create().info("this is an info message").addStack()
    it("can create an error message",()=>{
        const message="this is an error message"
        const errorMessage="this is an error"
        const level ="error"
        stack= syslog.create().error(message, errorMessage).addStack()      
        testIfMessageCreated(stack,message,level,errorMessage)

    })
    it("can create debug message",()=>{
        const message="this is debug message"
        const level ="debug"
        stack = syslog.create().debug(message).addStack()        
        testIfMessageCreated(stack,message,level)
    })
    it("can create warn message",()=>{
        const message="this is ward message"
        const level="warn"
        stack = syslog.create().debug(message).addStack()        
        testIfMessageCreated(stack,message,level)
    })    
    it("can create info message",()=>{
        const message="this is info message"     
        const level="info"   
        stack = syslog.create().info(message).addStack()        
        testIfMessageCreated(stack,message,level)
    })    
    it("can able to write logs",async()=>{
        const ableToWrite = await syslog.write(stack)        
        expect(ableToWrite).equals(true)        
    })
})