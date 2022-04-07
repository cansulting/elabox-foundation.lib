"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EboxEvent = void 0;
const constants_1 = require("./constants");
//import {Buffer} from 'buffer';
const socketio = require("socket.io-client");
/**
 * Class that facilitates event communication. Uses PUBSUB design pattern.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions,
 * you must first need to register to that specific package.
 */
class EboxEvent {
    /**
     * Constructor
     * @param eboxHost Url path of Elabox event server
     */
    constructor(eboxHost) {
        this.socket = socketio(eboxHost, { transports: ['websocket'] });
        this.connected = false;
        this.socket.on("connect", () => {
            this.connected = true;
            this.subscribe(constants_1.SYSTEM_PACKAGE);
        });
        this.socket.on("disconnected", () => {
            this.connected = false;
        });
        this.socket.on('connect_error', (err) => {
            //assert.equal(err, null || undefined, err.description.message)
            console.log("Error found", err);
        });
    }
    disconnect() {
    }
    /**
     * Wait until connected to server.
     * @returns boolean True if connected
     */
    waitUntilConnected(timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (this.connected) {
                resolve(true);
                return;
            }
            const timer = setTimeout(() => reject("Timeout"), timeout);
            this.onOnce('connect', () => {
                clearTimeout(timer);
                resolve(true);
            });
        });
    }
    /**
     * Listens to other socket events
     * @param evnt Which event we will listen to
     * @param callback Function to be called once the event is fired
     */
    on(evnt, callback) {
        this.socket.on(evnt, callback);
    }
    onOnce(evnt, callback) {
        this.socket.once(evnt, callback);
    }
    /**
     * Remove callback to specific event
     * @param evnt Which event we will remove
     * @param callback Function to be remove
     */
    off(evnt, callback) {
        this.socket.off(evnt, callback);
    }
    /**
     * listen to any specfic action. But you need to subscribe to specific package for its services
     * @param action Action which will listen to
     * @param callback Function to be called once an action was triggered
     */
    onAction(action, callback) {
        this.on(action, callback);
    }
    /**
     * listen to specific package for any of its event
     * @param packageId Which package we will listen to.
     */
    subscribe(packageId, callback) {
        let data = {
            id: constants_1.SUBSCRIBE_ACTION,
            packageId: packageId
        };
        this._emit(constants_1.SYSTEM_PACKAGE, data, callback);
    }
    _emit(events, data, callback) {
        if (callback)
            this.socket.emit(events, data, callback);
        else
            this.socket.emit(events, data);
    }
    // use to broadcast action to specific package. if no package was defined, use system package
    broadcast(actionId, packageId, data, callback) {
        let bdata = {
            id: constants_1.BROADCAST_ACTION,
            data: JSON.stringify({
                id: actionId,
                packageId: packageId,
                data: data
            })
        };
        this._emit(constants_1.SYSTEM_PACKAGE, bdata, callback);
    }
    /**
     * Send remote procedure call(RPC) to the target package
     * @param packageId The target RPC
     * @param actionPackage The package connected to this action
     * @param data The attached data to RPC call
     */
    sendRPC(packageId, actionId, actionPackage, data) {
        let bdata = {
            id: constants_1.RPC_ACTION,
            packageId: packageId,
            data: {
                id: actionId,
                packageId: actionPackage,
                data: data
            },
        };
        return new Promise((resolve, reject) => {
            this._emit(constants_1.SYSTEM_PACKAGE, bdata, (response) => {
                response = Buffer.from(response, 'base64').toString();
                resolve(JSON.parse(response));
            });
        });
    }
    /**
     * Sends RPC to system
     * @param actionPackage The package connected to this action
     * @param data The attached data to RPC call
     */
    sendSystemRPC(actionId, actionPackage, data) {
        return this.sendRPC(constants_1.SYSTEM_PACKAGE, actionId, actionPackage, data);
    }
    /**
     * Use to get the current system status.
     * @param callback Function to be called once status was returned.
     * Theres any changes this will also be called if listentoChanges is true
     * @param listenToChanges True if callback will also called when theres changes with system status.
     * False if only check the current status
     */
    getStatus(callback, listenToChanges = true) {
        this.on(constants_1.ELASTATUS_ENV, callback);
        if (listenToChanges) {
            this.onAction(constants_1.STATUSCHANGED_ACTION, callback);
        }
    }
}
exports.EboxEvent = EboxEvent;
