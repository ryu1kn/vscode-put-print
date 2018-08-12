import * as vscode from 'vscode';

export default class CounterInputBox {
    private readonly window: typeof vscode.window;

    constructor(params) {
        this.window = params.window;
    }

    read() {
        return this.window.showInputBox({
            placeHolder: 'Default to 0',
            prompt: 'Number to reset the counter',
            validateInput: this.validateInput
        }).then(str => {
            if (typeof str === 'undefined') return null;
            if (str === '') return 0;
            return parseInt(str, 10);
        });
    }

    private validateInput(input) {
        return isNaN(parseInt(input, 10)) ? 'Please specify a number' : null;
    }

}
