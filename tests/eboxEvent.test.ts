import { expect, assert } from 'chai'
import EventHandler from '../EboxEvent'

describe("Event System", () => {
    let instance :EventHandler
    it ("connection", (done) => {
        instance = new EventHandler('http://localhost')
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
            instance.broadcast(data)
        }else {
            done("Not connected to broadcast action.")
        }
        
    })
})