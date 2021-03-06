import * as vscode from 'vscode';

export default class CounterInputBox {

    constructor(private readonly window: typeof vscode.window) {}

    async read() {
        const input = await this.window.showInputBox({
            placeHolder: 'Default to 0',
            prompt: 'Number to reset the counter',
            validateInput: this.validateInput
        });

        if (typeof input === 'undefined') return null;
        if (input === '') return 0;
        return parseInt(input, 10);
    }

    private validateInput(input: string) {
        return isNaN(parseInt(input, 10)) ? 'Please specify a number' : '';
    }

}
