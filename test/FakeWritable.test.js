const FakeWritable = require('./FakeWritable');
const expect = require('chai').expect;

describe('FakeWritable', () => {
    describe('lines()', () => {
        it('should read line written as string seperated by \n', (done) => {
            const writable = new FakeWritable();
            writable.write('hello\n', (error) => {
                expect(error).to.be.undefined;
                expect(writable.lines()).to.deep.equal( ['hello\n'] );
                done();
            });
        });
        it('should read line written using two write calls', (done) => {
            const writable = new FakeWritable();
            writable.write('hel', (error) => {
                expect(error).to.be.undefined;
                writable.write('lo\n', (error) => {
                    expect(error).to.be.undefined;
                    expect(writable.lines()).to.deep.equal( ['hello\n'] );
                    done();
                });
            });
        });
    });
});