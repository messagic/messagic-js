const { Readable, Writable } = require('stream');
const expect = require('chai').expect;
const StreamsMessageChannel = require('../lib/StreamsMessageChannel');
const FakeReadable = require('./FakeReadable');
const FakeWritable = require('./FakeWritable');

describe('StreamsMessageChannel', () => {
    
    let readable, writable, channel;
    
    beforeEach(() => {
        readable = new FakeReadable();
        writable = new FakeWritable();
        channel = new StreamsMessageChannel(readable, writable);
    });

    afterEach(() => {
        channel.stop();
    });
    
    describe('sending', () => {
        it('should send text message to writable stream', () => {
            channel.start();
            channel.sendText('textMessage');
            expect(writable.lines()).to.deep.equal(['textMessage\n'])
        });
        it('should send binary message to writable stream', () => {
            channel.start();
            const buffer = new Int8Array([1,2,3]).buffer
            channel.sendBinary(buffer);
            expect(writable.lines()).to.deep.equal(['$AQID\n'])
        });
    });
    
    describe.skip('receiving', () => {
        it('should read encoded text message from readable stream and notify listener', (done) => {
            channel.addListener('text', (text) => {
                expect(text).to.be.equal('textMessage');
                done();
            });
            channel.start();
            readable.write('textMessage\n')
        });
    });
});