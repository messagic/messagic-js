const encodeBase64 = require('base64-arraybuffer').encode;

function OutgoingMessageFactory() {
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

module.exports = OutgoingMessageFactory;