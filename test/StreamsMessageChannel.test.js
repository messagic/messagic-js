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
        beforeEach(() => {
            channel.start();
        });
        afterEach(() => {
            channel.stop();
        });
        it('should send text message to writable stream', () => {
            channel.sendText('textMessage');
            expect(writable.lines()).to.deep.equal(['textMessage\n']);
        });
        it('should send binary message to writable stream', () => {
            const buffer = new Int8Array([1, 2, 3]).buffer;
            channel.sendBinary(buffer);
            expect(writable.lines()).to.deep.equal(['$AQID\n']);
        });
        it('should send empty text message to writable stream', () => {
            channel.sendText('');
            expect(writable.lines()).to.deep.equal(['\n']);
        });
        it('should send empty binary message to writable stream', () => {
            channel.sendBinary(new Int8Array([]).buffer);
            expect(writable.lines()).to.deep.equal(['$\n']);
        })

        describe('sending text messages with special characters', () => {
            const where = [
                { message: '#message', line: '##message\n' },
                { message: '$message', line: '#$message\n' },
                { message: '@message', line: '#@message\n' },
                { message: '.', line: '.\n' }
            ];
            where.forEach(e => {
                const lineFormatted = e.line.replace(/\n/, '\\n');
                it(`should send text message "${e.message}" encoded as "${lineFormatted}"`, () => {
                    channel.sendText(e.message);
                    expect(writable.lines()).to.deep.equal([e.line]);
                });
            });
        });

        describe('sending multi-line text messages', () => {
            const where = [
                { message: 'MULTI\nLINE', encoded: '@MULTI\nLINE\n.\n' },
                { message: 'MULTI\n', encoded: '@MULTI\n\n.\n' },
                { message: '\n', encoded: '@\n\n.\n' },
                { message: '\n.', encoded: '@\n..\n.\n' },
                { message: '\n..', encoded: '@\n...\n.\n' },
                { message: '@\n', encoded: '@@\n\n.\n' }
            ];
            where.forEach(e => {
                messageFormatted = e.message.replace(/\n/g, '\\n');
                encodedFormatted = e.encoded.replace(/\n/g, '\\n');
                it(`should send multi-line text message "${messageFormatted}" encoded as "${encodedFormatted}"`, () => {
                    channel.sendText(e.message);
                    expect(writable.linesJoined()).to.be.equal(e.encoded);
                });
            });
        })
    });

    describe('receiving', () => {
        describe('receiving one-line text messages', () => {
            const where = [
                { encodedMessage: 'textMessage\n', expectedMessage: 'textMessage' },
                { encodedMessage: '#textMessage\n', expectedMessage: 'textMessage' },
                { encodedMessage: '\n', expectedMessage: '' },
                { encodedMessage: '#\n', expectedMessage: '' },
                { encodedMessage: 'Aą\n', expectedMessage: 'Aą' },
                { encodedMessage: 'ą\n', expectedMessage: 'ą' }, // 2 bytes in UTF-8
                { encodedMessage: 'ಎ\n', expectedMessage: 'ಎ' }, // 3 bytes
                { encodedMessage: '𐊀\n', expectedMessage: '𐊀' } // 4 bytes
            ];
            where.forEach(e => {
                const encodedMessageFormatted = e.encodedMessage.replace(/\n/, '\\n');
                it(`should read encoded text message "${encodedMessageFormatted}" from readable stream and notify listener with "${e.expectedMessage}"`, (done) => {
                    channel.addListener('text', (text) => {
                        expect(text).to.be.equal(e.expectedMessage);
                        done();
                    });
                    channel.start();
                    readable.write(e.encodedMessage);
                });
            });
        });
        describe('receive one-line fragmented text messages', () => {
            it('should read fragmented encoded text message "textMessage\\n" and notifiy listener with "textMessage"', (done) => {
                channel.addListener('text', (text) => {
                    expect(text).to.be.equal('textMessage');
                    done();
                })
                channel.start();
                readable.write('text');
                readable.write('Message');
                readable.write('\n');
            })
        })
    });
});