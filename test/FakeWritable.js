const { Writable } = require('stream')

class FakeWritable extends Writable {

    constructor() {
        super({ decodeStrings: false });
        this._lines = Lines();
    }

    _write(chunk, encoding, callback) {
        this._lines.append(chunk);
        callback(null);
    }

    lines() {
        return this._lines.lines();
    }

    linesJoined() {
        return this._lines.lines().join('');
    }

}

function Lines() {
    
    const _lines = [];
    
    function append(string) {
        const fragments = string.split(/(\n)/g);
        for (const fragment of fragments) {
            _append(fragment);            
        }
    }

    function _append(fragment) {
        if (fragment.length > 0) {
            if (_lines.length == 0 || _lastLine().endsWith('\n')) {
                _lines.push(fragment);
            } else {
                _lines[_lines.length - 1] += fragment;
            }
        }
    }

    function _lastLine() {
        return _lines[_lines.length - 1];
    }

    function lines() {
        return [..._lines];
    }

    return {
        append: append,
        lines: lines
    }
}

module.exports = FakeWritable;