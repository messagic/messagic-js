const FakeReadable = require('./FakeReadable');
const expect = require('chai').expect;
const { Buffer } = require('buffer');

describe('FakeReadable', () => {
    it('synchronous write should emit data event', (done) => {
        const stream = new FakeReadable();
        const listener = (data) => {
            expect(data).to.deep.equal(Buffer.from('str'));
            done();
        }
        stream.addListener('data', listener);
        stream.write('str');
    });
    it('asynchronous write should emit data event', (done) => {
        const stream = new FakeReadable();
        const listener = (data) => {
            expect(data).to.deep.equal(Buffer.from('str'));
            done();
        }
        stream.addListener('data', listener);
        process.nextTick(() => {
            stream.write('str');
        }, 1);
    });
    it('write 2 x times should emit 2 data events', (done) => {
        const stream = new FakeReadable();
        let times = 0;
        const listener = (data) => {
            expect(data).to.deep.equal(Buffer.from('str'));
            times++;
            if (times == 2) {
                done();
            }
        }
        stream.addListener('data', listener);
        stream.write('str');
        stream.write('str');
    });
    it('end should emit end event', (done) => {
        const stream = new FakeReadable();
        const listener = (end) => {
            done();
        }
        stream.addListener('data', () => { }); // data listener is needed because once registered read method will be called
        stream.addListener('end', listener);
        stream.end();
    });
    it('close should emit close event', (done) => {
        const stream = new FakeReadable();
        const listener = (close) => {
            done();
        }
        stream.addListener('close', listener);
        stream.close();
    });
});