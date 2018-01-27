const { Writable } = require('stream')
const assert = require('assert')

class FakeWritable extends Writable {

    constructor() {
        super({ decodeStrings: false })
        this._lines = new Lines()
    }

    _write(chunk, encoding, callback) {
        this._lines.append(chunk)
        callback(null)
    }

    lines() {
        return this._lines.lines()
    }

}

class Lines {
    constructor() {
        this._lines = []
    }

    append(string) {
        let fragments = string.split(/(\n)/g)
        fragments.forEach(fragment => {
            this._append(fragment)
        });
    }

    _append(fragment) {
        if (this._lines.length == 0 || this._lastLineEndsWithEOL()) {
            if (fragment.length > 0) {
                this._lines.push(fragment)
            }
        } else {
            this._lines[this._lines.length - 1] += fragment
        }
    }

    _lastLineEndsWithEOL() {
        return this._lines[this._lines.length - 1].endsWith('\n');
    }

    lines() {
        return this._lines.slice(0)
    }

}

describe('FakeWritable', () => {
    describe('nextLine', () => {
        it('should read line written as string seperated by \n', (done) => {
            const writable = new FakeWritable()
            writable.write('hello\n', (error) => {
                assert.equal(error, null); // WTF? There is no assert.isNull?
                assert.deepEqual(writable.lines(), ['hello\n'])
                done()
            })
        })
        it('should read line written using two write calls', (done) => {
            const writable = new FakeWritable()
            writable.write('hel', (error) => {
                assert.equal(error, null); // WTF? There is no assert.isNull?
                writable.write('lo\n', (error) => {
                    assert.equal(error, null); // WTF? There is no assert.isNull?
                    assert.deepEqual(writable.lines(), ['hello\n'])
                    done()
                })
            })
        })
    })
})