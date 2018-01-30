const { encode, decode } = require('base64-arraybuffer');

module.exports = class StreamsMessageChannel {
    
    constructor(readableStream, writableStream) {
        readableStream.setEncoding('utf-8');
        this.readable = readableStream;
        this.writable = writableStream;
    }

    /**
     * @param {string} eventType: 'started', 'stopped', 'binaryMessage', 'textMessage', 'error'
     * @param {function} listener 
     */
    addListener(eventType, listener) {
        
    }

    removeListener(eventType, listener) {

    }

    start() {
    }

    /**
     * @param {string} message  
     */
    sendText(message) {
        this.writable.write(message + '\n'); 
    }

    /**
     * @param {ArrayBuffer} message 
     */
    sendBinary(message) {
        this.writable.write('$' + encode(message) + '\n');
    }

    stop() {

    }
}

