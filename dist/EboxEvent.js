"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
/**
 * Class that facilitates event communication. Uses PUBSUB design pattern.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions,
 * you must first need to register to that specific package.
 */
class EboxEvent {
    socket;
    /**
     * Constructor
     * @param eboxHost Url path of Elabox event server
     */
    constructor(eboxHost) {
        this.socket = (0, socket_io_client_1.default)(eboxHost, { transports: ['websocket'] });
        //this.socket.on("connect", () => {
        //    this.subscribe(constants_1.SYSTEM_PACKAGE);
        //});
    }
    /**
     * Listens to other socket events
     * @param evnt Which event we will listen to
     * @param callback Function to be called once the event is fired
     */
    on(evnt, callback) {
        this.socket.on(evnt, callback);
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
    subscribe(packageId) {
        this.socket.emit(constants_1.SYSTEM_PACKAGE, JSON.stringify({
            id: constants_1.SUBSCRIBE_ACTION,
            data: packageId
        }));
    }
    // use to broadcast action to specific package. if no package was defined, use system package
    broadcast(data) {
        let bdata = {
            id: constants_1.BROADCAST_ACTION,
            data: JSON.stringify(data)
        };
        this.socket.emit(constants_1.SYSTEM_PACKAGE, bdata);
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
exports.default = EboxEvent;
