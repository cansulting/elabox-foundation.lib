"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELASTATUS_ENV = exports.STATUSCHANGED_ACTION = exports.RPC_ACTION = exports.SUBSCRIBE_ACTION = exports.BROADCAST_ACTION = exports.SYSTEM_PACKAGE = void 0;
exports.SYSTEM_PACKAGE = "ela.system";
// action if that can be use for broadcast event system/specific package
exports.BROADCAST_ACTION = "ela.system.BROADCAST";
// action id that can be use for subscribing on a specific package action
exports.SUBSCRIBE_ACTION = "ela.system.SUBSCRIBE";
// use to send rpc to specific package
exports.RPC_ACTION = "ela.system.RPC";
// action id that triggers when the ela system status changed
exports.STATUSCHANGED_ACTION = "ela.broadcast.SYSTEM_STATUS_CHANGED";
// environment key for elastatus
exports.ELASTATUS_ENV = "elastatus";
