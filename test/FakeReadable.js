const { Readable } = require('stream');

class FakeReadable extends Readable {
    
    constructor() {
        super();
        this._stringsQueue = [];
        this._readPending = false;
    }

    _read(size) {
        if (this._stringsQueue.length > 0) {
            const str = this._stringsQueue.shift();
            this.push(str);
            this._readPending = false;
        } else {
            this._readPending = true;
        }
    }

    write(string) {
        if (this._readPending) {
            this.push(string);
        } else {
            this._stringsQueue.push(string);
        }
    }

    end() {
        this._stringsQueue.push(null);
    }

    close() {
        this.end();
        this.emit('close');
    }
   
}

module.exports = FakeReadable