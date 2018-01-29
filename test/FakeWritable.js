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
        if (fragment.length > 0) {
            if (this._lines.length == 0 || this._lastLine().endsWith('\n')) {
                this._lines.push(fragment);
            } else {
                this._lines[this._lines.length - 1] += fragment;
            }
        }
    }

    _lastLine() {
        return this._lines[this._lines.length - 1];
    }

    lines() {
        return [...this._lines];
    }

}

module.exports = FakeWritable;