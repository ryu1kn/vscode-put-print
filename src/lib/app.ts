import CounterInputBox from './counter-input-box';
import PrintStatementGenerator from './print-statement-generator';
import PrintStatementCounter from './print-statement-counter';
import PrintStatementSourceBuilder from './print-statement-source-builder';
import TextBuffer from './text-buffer';
import {Logger} from './logger';

export default class App {
    private _counterInputBox: CounterInputBox;
    private _printStatementGenerator: PrintStatementGenerator;
    private _printStatementCounter: PrintStatementCounter;
    private _printStatementSourceBuilder: PrintStatementSourceBuilder;
    private _textBuffer: TextBuffer;
    private _logger: Logger;

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
            const selectedExpression = this._textBuffer.read();
            const languageId = editor.document.languageId;
            const source = this._printStatementSourceBuilder.build(languageId, selectedExpression);
            const printStatement = this._printStatementGenerator.generate(source);
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
