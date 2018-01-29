const FakeWritable = require('./FakeWritable');
const assert = require('chai').assert;

describe('FakeWritable', () => {
    describe('lines()', () => {
        it('should read line written as string seperated by \n', (done) => {
            const writable = new FakeWritable()
            writable.write('hello\n', (error) => {
                assert.isUndefined(error);
                assert.deepEqual(writable.lines(), ['hello\n']);
                done();
            });
        });
        it('should read line written using two write calls', (done) => {
            const writable = new FakeWritable();
            writable.write('hel', (error) => {
                assert.isUndefined(error);
                writable.write('lo\n', (error) => {
                    assert.isUndefined(error);
                    assert.deepEqual(writable.lines(), ['hello\n']);
                    done();
                });
            });
        });
    });
});