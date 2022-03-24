export interface EventData {
    id: string;
    packageId?: string;
    data?: any;
}
/**
 * Class that facilitates event communication. Uses PUBSUB design pattern.
 * By default it will registers to ela.system or system package upon class initialization.
 * To use any specific package service so you can listen to its actions,
 * you must first need to register to that specific package.
 */
export declare class EboxEvent {
    socket: any;
    connected: boolean;
    /**
     * Constructor
     * @param eboxHost Url path of Elabox event server
     */
    constructor(eboxHost: string);
    disconnect(): void;
    /**
     * Wait until connected to server.
     * @returns boolean True if connected
     */
    waitUntilConnected(timeout?: number): Promise<Boolean>;
    /**
     * Listens to other socket events
     * @param evnt Which event we will listen to
     * @param callback Function to be called once the event is fired
     */
    on(evnt: string, callback: (args: any) => void): void;
    onOnce(evnt: string, callback: (args: any) => void): void;
    /**
     * Remove callback to specific event
     * @param evnt Which event we will remove
     * @param callback Function to be remove
     */
    off(evnt: string, callback: (args: any) => void): void;
    /**
     * listen to any specfic action. But you need to subscribe to specific package for its services
     * @param action Action which will listen to
     * @param callback Function to be called once an action was triggered
     */
    onAction(action: string, callback: (args: any) => void): void;
    /**
     * listen to specific package for any of its event
     * @param packageId Which package we will listen to.
     */
    subscribe(packageId: string, callback?: (response: any) => void): void;
    _emit(events: string, data: any, callback?: (response: any) => void): void;
    broadcast(actionId: string, packageId?: string, data?: any, callback?: (response: any) => void): void;
    /**
     * Send remote procedure call(RPC) to the target package
     * @param packageId The target RPC
     * @param data The attached data to RPC call
     */
    sendRPC(packageId: string, actionId: string, data?: any): Promise<any>;
    /**
     * Use to get the current system status.
     * @param callback Function to be called once status was returned.
     * Theres any changes this will also be called if listentoChanges is true
     * @param listenToChanges True if callback will also called when theres changes with system status.
     * False if only check the current status
     */
    getStatus(callback: (status: string) => {}, listenToChanges?: boolean): void;
}
