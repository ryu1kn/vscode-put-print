
const CounterInputBox = require('../../lib/counter-input-box');

suite('CounterInputBox', () => {

    test('it reads a number string from inputbox and returns as a number', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve('3'))};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(result => {
            expect(result).to.eql(3);
        });
    });

    test('it returns the default value 0 if a user left the input box empty', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve(''))};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(result => {
            expect(result).to.eql(0);
        });
    });
});
