const { Readable } = require('stream');

class FakeReadable extends Readable {
    
    constructor() {
        super({});
        this.strings = [];
        this.readPending = false;
    }

    _read(size) {
        if (this.strings.length > 0) {
            const str = this.strings.shift();
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
            this.strings.push(string);
        }
    }

    end() {
        this.strings.push(null);
    }

    close() {
        this.end();
        this.emit('close');
    }
   
}

module.exports = FakeReadable;