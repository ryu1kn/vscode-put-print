
'use strict';

const util = require('util');

const RE_SELECTION_PLACEHOLDER = /{{selection}}/g;

class PutPrintCommand {
    constructor(params) {
        this._editor = params.editor;
        this._workspace = params.workspace;
        this._logger = params.logger;
    }

    execute() {
        try {
            const selection = this._editor.selection;
            if (selection.isEmpty) return;

            const template = this._getTemplate(this._editor.document.languageId);
            const selectedText = this._editor.document.getText(selection);
            const printStatement = template.replace(RE_SELECTION_PLACEHOLDER, selectedText);

            this._editor.edit(editBuilder => {
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
