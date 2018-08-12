import * as assert from 'assert';
import PrintStatementCounter from '../../lib/print-statement-counter';

suite('PrintStatementCounter', () => {

    test('it initially has counter value 0', () => {
        const counter = new PrintStatementCounter();
        assert.deepEqual(counter.getAndIncrement(), 0);
    });

    test('it increments the value every time the counter value is retrieved', () => {
        const counter = new PrintStatementCounter();
        assert.deepEqual(counter.getAndIncrement(), 0);
        assert.deepEqual(counter.getAndIncrement(), 1);
    });

    test('it resets the counter with the specified value', () => {
        const counter = new PrintStatementCounter();
        assert.deepEqual(counter.getAndIncrement(), 0);
        counter.reset(4);
        assert.deepEqual(counter.getAndIncrement(), 4);
    });
});
