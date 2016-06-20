
'use strict';

class App {
    constructor(params) {
        this._counterInputBox = params.counterInputBox;
        this._printStatementBuilder = params.printStatementBuilder;
        this._printStatementCounter = params.printStatementCounter;
        this._templateConfigProvider = params.templateConfigProvider;
        this._textBuffer = params.textBuffer;
        this._logger = params.logger;
    }

    putPrintStatement(editor) {
        return Promise.resolve().then(() => {
            const selectedText = this._textBuffer.read();
            if (!selectedText) return;

            const templateConfig = this._templateConfigProvider.get(editor.document.languageId);
            const printStatement = this._printStatementBuilder.build(templateConfig, selectedText);
            return editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, printStatement);
            });
        }).catch(e => {
            this._logger.error(e.stack);
        });
    }

    saveText(editor) {
        this._textBuffer.write(this._getSelectedText(editor));
    }

    resetCounter() {
        return this._counterInputBox.read().then(value => {
            if (typeof value === 'number') this._printStatementCounter.reset(value);
        });
    }

    _getSelectedText(editor) {
        return editor.document.getText(editor.selection);
    }
}

module.exports = App;
