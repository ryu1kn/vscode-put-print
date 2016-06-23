
'use strict';

class App {
    constructor(params) {
        this._counterInputBox = params.counterInputBox;
        this._printStatementGenerator = params.printStatementGenerator;
        this._printStatementCounter = params.printStatementCounter;
        this._printStatementSourceBuilder = params.printStatementSourceBuilder;
        this._textBuffer = params.textBuffer;
        this._logger = params.logger;
    }

    putPrintStatement(editor) {
        return Promise.resolve().then(() => {
            const selectedText = this._textBuffer.read();
            const config = this._printStatementSourceBuilder.build(editor.document.languageId, !!selectedText);
            const printStatement = this._printStatementGenerator.generate(selectedText, config);
            return editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, printStatement);
            });
        }).catch(e => {
            this._handleError(e);
        });
    }

    selectExpression(editor) {
        try {
            this._textBuffer.write(this._getSelectedText(editor));
        } catch (e) {
            this._handleError(e);
        }
    }

    resetCounter() {
        return Promise.resolve(this._counterInputBox.read()).then(value => {
            if (typeof value === 'number') this._printStatementCounter.reset(value);
        }).catch(e => {
            this._handleError(e);
        });
    }

    _getSelectedText(editor) {
        return editor.document.getText(editor.selection);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
