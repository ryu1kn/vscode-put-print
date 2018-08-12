import * as vscode from 'vscode';

export default class CounterInputBox {
    private _window: typeof vscode.window;

    constructor(params) {
        this._window = params.window;
    }

    read() {
        return this._window.showInputBox({
            placeHolder: 'Default to 0',
            prompt: 'Number to reset the counter',
            validateInput: this._validateInput
        }).then(str => {
            if (typeof str === 'undefined') return null;
            if (str === '') return 0;
            return parseInt(str, 10);
        });
    }

    _validateInput(input) {
        return isNaN(parseInt(input, 10)) ? 'Please specify a number' : null;
    }

}