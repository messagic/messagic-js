const decode = require('base64-arraybuffer').decode;
const EventEmitter = require('events');
const OutgoingMessageFactory = require('./OutgoingMessageFactory')
const IncomingMessageStream = require('./IncomingMessageStream')

module.exports = class StreamsMessageChannel {

    constructor(readableStream, writableStream) {
        readableStream.setEncoding('utf-8');
        this.readable = readableStream;
        this.writable = writableStream;
        this.outgoingMessageFactory = OutgoingMessageFactory();
        this.eventEmitter = new EventEmitter();
        this.incomingMessageStream = IncomingMessageStream(readableStream, (message) => {
            this.eventEmitter.emit(message.type, message.value);
        });
    }

    /**
     * @param {string} eventType: 'started', 'stopped', 'binary', 'text', 'error'
     * @param {function} listener 
     */
    addListener(eventType, listener) {
        this.eventEmitter.addListener(eventType, listener);
    }

    removeListener(eventType, listener) {

    }

    start() {
        this.incomingMessageStream.start();
    }

    sendText(string) {
        const message = this.outgoingMessageFactory.textMessage(string);
        message.encode(this.writable);
    }

    sendBinary(arrayBuffer) {
        const message = this.outgoingMessageFactory.binaryMessage(arrayBuffer);
        message.encode(this.writable);
    }

    stop() {

    }
}
