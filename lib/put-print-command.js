
'use strict';

const util = require('util');

const PRINT_TEMPLATE = 'console(\'%s:\', %s);';

class PutPrintCommand {
    constructor(params) {
        this._editor = params.editor;
    }

    execute() {
        const selection = this._editor.selection;
        if (selection.isEmpty) {
            return;
        }

        const selectedText = this._editor.document.getText(selection);
        const printStatement = util.format(PRINT_TEMPLATE, selectedText, selectedText);

        this._editor.edit(editBuilder => {
            editBuilder.replace(selection, printStatement);
        });
    }
}

module.exports = PutPrintCommand;
