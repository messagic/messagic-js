const EventEmitter = require('events');
const OutgoingMessageFactory = require('./OutgoingMessageFactory');
const IncomingMessageStream = require('./IncomingMessageStream');

function StreamsMessageChannel(readableStream, writableStream) {
    readableStream.setEncoding('utf-8');
    const outgoingMessageFactory = OutgoingMessageFactory();
    const eventEmitter = new EventEmitter();
    const incomingMessageStream = IncomingMessageStream(readableStream, (message) => {
        eventEmitter.emit(message.type, message.value);
    });

    /**
     * @param {string} eventType: 'started', 'stopped', 'binary', 'text', 'error'
     * @param {function} listener 
     */
    function addListener(eventType, listener) {
        eventEmitter.addListener(eventType, listener);
    }

    function removeListener(eventType, listener) {

    }

    function start() {
        incomingMessageStream.start();
    }

    function sendText(string) {
        const message = outgoingMessageFactory.textMessage(string);
        message.encode(writableStream);
    }

    function sendBinary(arrayBuffer) {
        const message = outgoingMessageFactory.binaryMessage(arrayBuffer);
        message.encode(writableStream);
    }

    function stop() {

    }
    return {
        addListener: addListener,
        removeListener: removeListener,
        start: start,
        sendText: sendText,
        sendBinary: sendBinary,
        stop: stop
    };
}


module.exports = StreamsMessageChannel;
