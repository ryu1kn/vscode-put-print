
'use strict';

class CounterInputBox {
    constructor(params) {
        this._window = params.window;
    }

    read() {
        return this._window.showInputBox({
            placeHolder: 'default to 0',
            value: 0,
            prompt: 'Number to reset the counter',
            validateInput: this._validateInput
        }).then(str => {
            if (typeof str === 'undefined') return null;
            else if (str === '') return 0;
            return parseInt(str, 10);
        });
    }

    _validateInput(input) {
        return isNaN(parseInt(input, 10)) ? 'Please specify a number' : null;
    }
}

module.exports = CounterInputBox;
