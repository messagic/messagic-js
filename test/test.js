const { Readable, Writable } = require('stream');
const assert = require('assert');
const StreamsMessageChannel = require('../index.js');
const FakeReadable = require('./FakeReadable.js')

describe('StreamsMessageChannel', () => {
    const readableStream = new FakeReadable()
    describe('sending', () => {
        it('should send text message to output stream', () => {
            const channel = new StreamsMessageChannel(readableStream, null)
            channel.start()
            channel.send('textMessage')
        })
    })
    describe('receiving', () => {
        it('should read encoded text message from input stream and notify listener', () => {

        })
    })
})