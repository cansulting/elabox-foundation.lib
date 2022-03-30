import { SYSTEM_PACKAGE, 
    BROADCAST_ACTION, 
    SUBSCRIBE_ACTION, 
    ELASTATUS_ENV,
    STATUSCHANGED_ACTION,
    RPC_ACTION
} from "./constants"
//import {Buffer} from 'buffer';
const socketio = require( "socket.io-client")

export interface EventData {
    id: string               // action id
    packageId?: string       // package id can be ela.system
    data?: any               // any data attached to event
} 

/**
 * Class that facilitates event communication. Uses PUBSUB design pattern.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions, 
 * you must first need to register to that specific package.
 */
 export class EboxEvent {
    socket : any
    connected : boolean

    /**
     * Constructor
     * @param eboxHost Url path of Elabox event server 
     */
    constructor(eboxHost:string) {
        this.socket = socketio(eboxHost, {transports: ['websocket']})
        this.connected = false
        this.socket.on("connect", () => {
            this.connected = true
            this.subscribe(SYSTEM_PACKAGE)
        })
        this.socket.on("disconnected", () => {
            this.connected = false
        })
        this.socket.on('connect_error', (err: Error) => {
            //assert.equal(err, null || undefined, err.description.message)
            
            console.log("Error found", err)
        })
    }

    disconnect() {

    }

    /**
     * Wait until connected to server.
     * @returns boolean True if connected
     */
    waitUntilConnected(timeout = 5000) : Promise<Boolean> {
        return new Promise((resolve, reject) => {
            if  (this.connected) {
                resolve(true)
                return
            }
            const timer = setTimeout(() => reject("Timeout"), timeout)
            this.onOnce('connect', () => {
                clearTimeout(timer)
                resolve(true)
            })
        })
    }
    
    /**
     * Listens to other socket events
     * @param evnt Which event we will listen to
     * @param callback Function to be called once the event is fired
     */
    on(evnt:string, callback : (args:any) => void) {
        this.socket.on(evnt, callback)
    }

    onOnce(evnt:string, callback : (args:any) => void) {
        this.socket.once(evnt, callback)
    }

    /**
     * Remove callback to specific event
     * @param evnt Which event we will remove
     * @param callback Function to be remove
     */
    off(evnt:string, callback : (args:any) => void) {
        this.socket.off(evnt, callback)
    }
    
    /**
     * listen to any specfic action. But you need to subscribe to specific package for its services
     * @param action Action which will listen to
     * @param callback Function to be called once an action was triggered
     */
    onAction(action: string, callback: (args:any) => void) {
        this.on(action, callback)
    }

    /** 
     * listen to specific package for any of its event
     * @param packageId Which package we will listen to.
     */
    subscribe(packageId:string, callback?: (response:any) => void) {
        let data = {
            id: SUBSCRIBE_ACTION,
            packageId: packageId
        }
        this._emit(SYSTEM_PACKAGE, data, callback)
    }

    _emit(events:string, data : any, callback?: (response:any) => void ) {
        if (callback)
            this.socket.emit(events, data, callback)
        else
            this.socket.emit(events, data)
    }

    // use to broadcast action to specific package. if no package was defined, use system package
    broadcast(actionId: string, packageId?: string, data? : any, callback? : (response:any) => void) {
        let bdata = {
            id: BROADCAST_ACTION,
            data: JSON.stringify({
                id: actionId,
                packageId: packageId,
                data: data
            })
        }
        this._emit(SYSTEM_PACKAGE,  bdata, callback)
    }
    
    /**
     * Send remote procedure call(RPC) to the target package
     * @param packageId The target RPC 
     * @param actionPackage The package connected to this action
     * @param data The attached data to RPC call
     */
    sendRPC(packageId:string, actionId: string, actionPackage?: string, data? : any) : Promise<any> {
        let bdata = {
            id: RPC_ACTION,
            packageId: packageId,
            data: {
                id: actionId,
                packageId: actionPackage,
                data: data
            },
        }
        return new Promise((resolve, reject) => {
            this._emit(SYSTEM_PACKAGE,  bdata, (response) => {
                response = Buffer.from(response, 'base64').toString()
                resolve(JSON.parse(response));
            })
        })
    }


    /**
     * Use to get the current system status.
     * @param callback Function to be called once status was returned. 
     * Theres any changes this will also be called if listentoChanges is true
     * @param listenToChanges True if callback will also called when theres changes with system status. 
     * False if only check the current status
     */
    getStatus(callback: (status: string) => {}, listenToChanges = true) {
        this.on(ELASTATUS_ENV, callback)
        if (listenToChanges) {
            this.onAction(STATUSCHANGED_ACTION, callback)
        }
    } 
}