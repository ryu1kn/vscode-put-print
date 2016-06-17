
'use strict';

class App {
    constructor(params) {
        this._printStatementBuilder = params.printStatementBuilder;
        this._templateConfigProvider = params.templateConfigProvider;
        this._textBuffer = params.textBuffer;
        this._logger = params.logger;
    }

    putPrintStatement(editor) {
        try {
            const templateConfig = this._templateConfigProvider.get(editor.document.languageId);
            const selectedText = this._textBuffer.read();
            const printStatement = this._printStatementBuilder.build(templateConfig, selectedText);
            return editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, printStatement);
            });
        } catch (e) {
            this._logger.error(e.stack);
        }
    }

    saveText(editor) {
        this._textBuffer.write(this._getSelectedText(editor));
    }

    _getSelectedText(editor) {
        return editor.document.getText(editor.selection);
    }
}

module.exports = App;
