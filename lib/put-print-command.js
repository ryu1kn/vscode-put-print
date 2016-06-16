
'use strict';

const util = require('util');

class PutPrintCommand {
    constructor(params) {
        this._editor = params.vscode.window.activeTextEditor;
        this._printStatementBuilder = params.printStatementBuilder;
        this._templateConfigProvider = params.templateConfigProvider;
        this._logger = params.logger;
    }

    execute() {
        try {
            const selection = this._editor.selection;
            if (selection.isEmpty) return;

            const templateConfig = this._templateConfigProvider.get(this._editor.document.languageId);
            const selectedText = this._editor.document.getText(selection);

            this._editor.edit(editBuilder => {
                const printStatement = this._printStatementBuilder.build(templateConfig, selectedText);
                editBuilder.replace(selection, printStatement);
            });
        } catch (e) {
            this._logger.error(e.stack);
        }
    }
}

module.exports = PutPrintCommand;
