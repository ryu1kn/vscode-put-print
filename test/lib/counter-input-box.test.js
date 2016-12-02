
const CounterInputBox = require('../../lib/counter-input-box');

suite('CounterInputBox', () => {

    test('it reads a number string from inputbox and returns as a number', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve('3'))};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(result => {
            expect(result).to.eql(3);
            expect(window.showInputBox.args[0][0].placeHolder).to.eql('Default to 0');
            expect(window.showInputBox.args[0][0].prompt).to.eql('Number to reset the counter');
            expect(window.showInputBox.args[0][0].validateInput).to.be.an('function');
        });
    });

    test('it returns null if a user dismiss the input box without confirming the input', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve())};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(result => {
            expect(result).to.be.null;
        });
    });

    test('it returns the default value 0 if a user left the input box empty', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve(''))};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(result => {
            expect(result).to.eql(0);
        });
    });

    test('it specifies a validation function that gives instruction message when non number string is given', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve(''))};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(_result => {
            const validationFn = window.showInputBox.args[0][0].validateInput;
            expect(validationFn('NON_NUMBER')).to.eql('Please specify a number');
        });
    });

    test('it specifies a validation function that gives nothing if a number string is given', () => {
        const window = {showInputBox: sinon.stub().returns(Promise.resolve(''))};
        const inputBox = new CounterInputBox({window});
        return inputBox.read().then(_result => {
            const validationFn = window.showInputBox.args[0][0].validateInput;
            expect(validationFn('3')).to.be.null;
        });
    });

});
