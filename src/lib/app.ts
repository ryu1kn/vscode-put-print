import CounterInputBox from './counter-input-box';
import PrintStatementGenerator from './print-statement-generator';
import PrintStatementCounter from './print-statement-counter';
import PrintStatementSourceBuilder from './print-statement-source-builder';
import TextBuffer from './text-buffer';
import {Logger} from './logger';
import * as vscode from 'vscode';

export default class App {
    private readonly counterInputBox: CounterInputBox;
    private readonly printStatementGenerator: PrintStatementGenerator;
    private readonly printStatementCounter: PrintStatementCounter;
    private readonly printStatementSourceBuilder: PrintStatementSourceBuilder;
    private readonly textBuffer: TextBuffer;
    private readonly logger: Logger;

    constructor(printStatementGenerator: PrintStatementGenerator,
                printStatementCounter: PrintStatementCounter,
                printStatementSourceBuilder: PrintStatementSourceBuilder,
                textBuffer: TextBuffer,
                counterInputBox: CounterInputBox,
                logger: Logger) {
        this.counterInputBox = counterInputBox;
        this.printStatementGenerator = printStatementGenerator;
        this.printStatementCounter = printStatementCounter;
        this.printStatementSourceBuilder = printStatementSourceBuilder;
        this.textBuffer = textBuffer;
        this.logger = logger;
    }

    putPrintStatement(editor: vscode.TextEditor) {
        return Promise.resolve().then(() => {
            const selectedExpression = this.textBuffer.read();
            const languageId = editor.document.languageId;
            const source = this.printStatementSourceBuilder.build(languageId, selectedExpression);
            const printStatement = this.printStatementGenerator.generate(source);
            return editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, printStatement);
            });
        }).catch(e => {
            this.handleError(e);
        });
    }

    selectExpression(editor: vscode.TextEditor) {
        try {
            this.textBuffer.write(this.getSelectedText(editor));
        } catch (e) {
            this.handleError(e);
        }
    }

    resetCounter() {
        return Promise.resolve(this.counterInputBox.read()).then(value => {
            if (typeof value === 'number') this.printStatementCounter.reset(value);
        }).catch(e => {
            this.handleError(e);
        });
    }

    private getSelectedText(editor: vscode.TextEditor) {
        return editor.document.getText(editor.selection);
    }

    private handleError(e: Error) {
        this.logger.error(e.stack);
    }

}
