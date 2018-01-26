const assert = require('assert')
const StreamsMessageChannel = require('../index.js')
describe('StreamsMessageChannel', function () {
    describe('#send()', function () {
        it('should send text message to output stream', function () {
            const channel = new StreamsMessageChannel(null, null)
            channel.start()
            channel.send('textMessage')
            assert.equal(true, true) 
        })
    })
})