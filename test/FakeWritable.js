const { Writable } = require('stream')

class FakeWritable extends Writable {

    constructor() {
        super({ decodeStrings: false });
        this._lines = new Lines();
    }

    _write(chunk, encoding, callback) {
        this._lines.append(chunk);
        callback(null);
    }

    lines() {
        return this._lines.lines();
    }

}

class Lines {
    constructor() {
        this._lines = [];
    }

    append(string) {
        let fragments = string.split(/(\n)/g);
        fragments.forEach(fragment => {
            this._append(fragment);
        });
    }

    _append(fragment) {
        if (this._lines.length == 0 || this._lastLineEndsWithEOL()) {
            if (fragment.length > 0) {
                this._lines.push(fragment);
            }
        } else {
            this._lines[this._lines.length - 1] += fragment;
        }
    }

    _lastLineEndsWithEOL() {
        return this._lines[this._lines.length - 1].endsWith('\n');
    }

    lines() {
        return this._lines.slice(0);
    }

}

module.exports = FakeWritable;