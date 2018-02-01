const { encode: encodeBase64, decode } = require('base64-arraybuffer');

module.exports = class StreamsMessageChannel {

    constructor(readableStream, writableStream) {
        readableStream.setEncoding('utf-8');
        this.readable = readableStream;
        this.writable = writableStream;
        this.messageFactory = MessageFactory();
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

    sendText(string) {
        const message = this.messageFactory.textMessage(string);
        message.encode(this.writable);
    }

    sendBinary(arrayBuffer) {
        const message = this.messageFactory.binaryMessage(arrayBuffer);
        message.encode(this.writable);
    }

    stop() {

    }
}

function MessageFactory() {
    function textMessage(string) {
        if (string.indexOf('\n') > -1) {
            return MultiLineTextMessage(string);
        } else {
            return OneLineTextMessage(string);
        }
    }
    function binaryMessage(arrayBuffer) {
        return BinaryMessage(arrayBuffer);
    }
    return {
        textMessage: textMessage,
        binaryMessage: binaryMessage
    };
}

function OneLineTextMessage(string) {
    function encode(writable) {
        if (messageStartsWithSpecialCharacter()) {
            writable.write('#');
        }
        writable.write(string);
        writable.write('\n');
    }
    function messageStartsWithSpecialCharacter() {
        if (string != '') {
            const firstChar = string.charAt(0)
            return firstChar == '#' || firstChar == '$' || firstChar == '@';
        } else {
            return false;
        }
    }
    return {
        encode: encode
    };
}

function MultiLineTextMessage(string) {
    function encode(writable) {
        writable.write('@');
        const escapedString = string.replace('\n.', '\n..');
        writable.write(escapedString);
        writable.write('\n');
        writable.write('.');
        writable.write('\n');
    }
    return {
        encode: encode
    };
}

function BinaryMessage(arrayBuffer) {
    function encode(writable) {
        writable.write('$');
        writable.write(encodeBase64(arrayBuffer));
        writable.write('\n');
    }
    return {
        encode: encode
    };
}