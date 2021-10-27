import { expect, assert } from 'chai'
import { EboxEvent } from '../EboxEvent'
import { RPC_ACTION, SYSTEM_PACKAGE } from '../constants'

describe("Event System", () => {
    let instance :EboxEvent
    it ("connection", (done) => {
        instance = new EboxEvent('http://localhost')
        if (instance.connected)  {
            done()
        } else {
            instance.on('connect', () => {
                done()
            })
            instance.on('connect_error', (err) => {
                //assert.equal(err, null || undefined, err.description.message)
                done(err.description.message)
            })
        }
    })
    it ("broadcasting", (done) => {
        if (instance.connected) {
            instance.subscribe("app.testing")
            instance.onAction("testaction", (_arg) => {
                done()
            })
            const data = {
                id: "testaction",
                packageId: "app.testing",
                data: "this is it!"
            }
            instance.broadcast(data, (response) => console.log("Broadcast response " + response))
        }else {
            done("Not connected to broadcast action.")
        }
        
    })
    it ("RPC", (done) => {
        instance.sendRPC(
            SYSTEM_PACKAGE,{
            id: "testrpc",
            data: "HELLO"
        }, (response) => {
            console.log("Recieved " + response )
            done()
        })

    })
})