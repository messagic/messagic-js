const { Readable } = require('stream');

class FakeReadable extends Readable {
    
    constructor() {
        super({});
        this.stringsQueue = [];
        this.readPending = false;
    }

    _read(size) {
        if (this.stringsQueue.length > 0) {
            const str = this.stringsQueue.shift();
            this.push(str);
            this.readPending = false;
        } else {
            this.readPending = true;
        }
    }

    write(string) {
        if (this.readPending) {
            this.push(string);
        } else {
            this.stringsQueue.push(string);
        }
    }

    end() {
        this.stringsQueue.push(null);
    }

    close() {
        this.end();
        this.emit('close');
    }
   
}

module.exports = FakeReadable;