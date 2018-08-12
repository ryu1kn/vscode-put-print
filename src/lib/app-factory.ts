import App from './app';
import CounterInputBox from './counter-input-box';
import PrintStatementCounter from './print-statement-counter';
import PrintStatementGenerator from './print-statement-generator';
import PrintStatementSourceBuilder from './print-statement-source-builder';
import TextBuffer from './text-buffer';

export default class AppFactory {

    create(vscode, logger) {
        const counterInputBox = new CounterInputBox({window: vscode.window});
        const printStatementCounter = new PrintStatementCounter();
        const printStatementGenerator = new PrintStatementGenerator({printStatementCounter});
        const printStatementSourceBuilder = new PrintStatementSourceBuilder({workspace: vscode.workspace});
        const textBuffer = new TextBuffer();
        return new App({
            counterInputBox,
            printStatementGenerator,
            printStatementCounter,
            printStatementSourceBuilder,
            textBuffer,
            logger
        });
    }

}
