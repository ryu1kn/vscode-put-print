
const PrintStatementCounter = require('../../lib/print-statement-counter');

suite('PrintStatementCounter', () => {

    test('it initially has counter value 0', () => {
        const counter = new PrintStatementCounter();
        expect(counter.getAndIncrement()).to.eql(0);
    });

    test('it increments the value every time the counter value is retrieved', () => {
        const counter = new PrintStatementCounter();
        expect(counter.getAndIncrement()).to.eql(0);
        expect(counter.getAndIncrement()).to.eql(1);
    });

    test('it resets the counter with the specified value', () => {
        const counter = new PrintStatementCounter();
        expect(counter.getAndIncrement()).to.eql(0);
        counter.reset(4);
        expect(counter.getAndIncrement()).to.eql(4);
    });
});
