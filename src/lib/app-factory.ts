import App from './app';
import CounterInputBox from './counter-input-box';
import PrintStatementCounter from './print-statement-counter';
import PrintStatementGenerator from './print-statement-generator';
import PrintStatementSourceBuilder from './print-statement-source-builder';
import TextBuffer from './text-buffer';
import {Logger} from './logger';

export default class AppFactory {

    create(vscode: any, logger: Logger) {
        const counterInputBox = new CounterInputBox(vscode.window);
        const printStatementCounter = new PrintStatementCounter();
        const printStatementGenerator = new PrintStatementGenerator(printStatementCounter);
        const printStatementSourceBuilder = new PrintStatementSourceBuilder(vscode.workspace);
        const textBuffer = new TextBuffer();
        return new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
    }

}
