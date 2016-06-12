
'use strict';

const util = require('util');

const RE_SELECTION_ESCAPE_PLACEHOLDER = /{{selection:escape}}/g;
const RE_SELECTION_PLACEHOLDER = /{{selection}}/g;

class PutPrintCommand {
    constructor(params) {
        this._editor = params.vscode.window.activeTextEditor;
        this._workspace = params.vscode.workspace;
        this._logger = params.logger;
    }

    execute() {
        try {
            const selection = this._editor.selection;
            if (selection.isEmpty) return;

            const template = this._getTemplate(this._editor.document.languageId);
            const selectedText = this._editor.document.getText(selection);

            this._editor.edit(editBuilder => {
                editBuilder.replace(selection, this._resolveText(template, selectedText));
            });
        } catch (e) {
            this._logger.error(e.stack);
        }
    }

    _resolveText(template, selectedText) {
        const escapedSelectedText = selectedText.replace(/'/g, "\\'");
        return template.split(RE_SELECTION_ESCAPE_PLACEHOLDER).map(subtext =>
            subtext.replace(RE_SELECTION_PLACEHOLDER, selectedText)
        ).join(escapedSelectedText);
    }

    _getTemplate(languageId) {
        const extensionConfig = this._workspace.getConfiguration('putprint');
        const template = extensionConfig.get(`printTemplate.${languageId}`);
        return template || extensionConfig.get('printTemplate.default');
    }
}

module.exports = PutPrintCommand;
