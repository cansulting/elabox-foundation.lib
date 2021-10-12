import { SYSTEM_PACKAGE, 
    BROADCAST_ACTION, 
    SUBSCRIBE_ACTION, 
    ELASTATUS_ENV,
    STATUSCHANGED_ACTION
} from "./constants"
const socketio = require( "socket.io-client")

export interface EventData {
    id: string          // action id
    packageId?: string       // package id can be ela.system
    data?: any               // any data attached to event
} 

/**
 * Class that facilitates event communication. Uses PUBSUB design pattern.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions, 
 * you must first need to register to that specific package.
 */
 class EboxEvent {
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
            this.connected
        })
    }

    /**
     * Listens to other socket events
     * @param evnt Which event we will listen to
     * @param callback Function to be called once the event is fired
     */
    on(evnt:string, callback : (...args:any) => void) {
        this.socket.on(evnt, callback)
    }
    
    /**
     * listen to any specfic action. But you need to subscribe to specific package for its services
     * @param action Action which will listen to
     * @param callback Function to be called once an action was triggered
     */
    onAction(action: string, callback: (...args:any) => void) {
        this.on(action, callback)
    }

    /** 
     * listen to specific package for any of its event
     * @param packageId Which package we will listen to.
     */
    subscribe(packageId:string, callback?: (...response:any) => void) {
        let data = {
            id: SUBSCRIBE_ACTION,
            data: packageId
        }
        this.socket.emit(SYSTEM_PACKAGE, data)
    }

    // use to broadcast action to specific package. if no package was defined, use system package
    broadcast(data : EventData, callback? : (...response:any) => void) {
        let bdata = {
            id: BROADCAST_ACTION,
            data: JSON.stringify(data)
        }
        this.socket.emit(SYSTEM_PACKAGE,  bdata)
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

export default EboxEvent