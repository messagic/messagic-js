/**
 * @param {Readable} readable Node's Readable Stream  
 */
function IncomingMessageStream(readable, onMessage) {
    readable.setEncoding('utf-8');
    let message = UnknownMessage();

    function start() {
        readable.on('data', (chunk) => {
            if (typeof chunk == 'string') {
                const fragment = chunk;
                message = message.append(fragment);
                while (message.complete()) {
                    onMessage(message.decoded());
                    message = message.nextMessage();
                }
            } else {
                console.error('TODO: This should never happen because encoding is set! Am I right?');
            }
        });
    }
    
    return {
        start: start
    }
}

function UnknownMessage() {
    function append(fragment) {
        if (fragment.length == 0) {
            return UnknownMessage();
        }
        const messageTypeOrFistCharacter = fragment.charAt(0)
        if (messageTypeOrFistCharacter == '@') {
            // message = MultiLineMessage(stringChunk);
            return OneLineMessage(fragment);
        } else {
            return OneLineMessage(fragment);
        }
    }
    function complete() {
        return false;
    }
    function nextMessage() {
        return UnknownMessage();
    }
    function decoded() {
        return null;
    }
    return {
        append: append,
        complete: complete,
        nextMessage: nextMessage,
        decoded: decoded
    };
}

function OneLineMessage(fragment) {
    const eolIndex = fragment.indexOf('\n');
    let _text, _rest;
    let _complete = false;
    if (eolIndex > -1) {
        _text = fragment.substr(0, eolIndex);
        _rest = fragment.substr(eolIndex + 1);
        _complete = true;
    } else {
        _text = fragment;
    }

    function append(fragment) {
        return OneLineMessage(_text + fragment);
    }

    function complete() {
        return _complete;
    }

    function nextMessage() {
        return UnknownMessage().append(_rest);
    }

    function decoded() {
        const text = _text.startsWith('#') ? _text.substr(1) : _text;
        return {
            type: "text",
            value: text
        }
    }

    return {
        append: append,
        complete: complete,
        nextMessage: nextMessage,
        decoded: decoded
    };
}

module.exports = IncomingMessageStream;