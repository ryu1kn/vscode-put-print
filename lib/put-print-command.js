
'use strict';

const util = require('util');

class PutPrintCommand {
    constructor(params) {
        this._editor = params.vscode.window.activeTextEditor;
        this._workspace = params.vscode.workspace;
        this._printStatementBuilder = params.printStatementBuilder;
        this._logger = params.logger;
    }

    execute() {
        try {
            const selection = this._editor.selection;
            if (selection.isEmpty) return;

            const template = this._getTemplate(this._editor.document.languageId);
            const selectedText = this._editor.document.getText(selection);

            this._editor.edit(editBuilder => {
                const printStatement = this._printStatementBuilder.build(template, selectedText);
                editBuilder.replace(selection, printStatement);
            });
        } catch (e) {
            this._logger.error(e.stack);
        }
    }

    _getTemplate(languageId) {
        const extensionConfig = this._workspace.getConfiguration('putprint');
        const template = extensionConfig.get(`printTemplate.${languageId}`);
        return template || extensionConfig.get('printTemplate.default');
    }
}

module.exports = PutPrintCommand;
