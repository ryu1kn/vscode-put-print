
const App = require('./app');
const CounterInputBox = require('./counter-input-box');
const PrintStatementCounter = require('./print-statement-counter');
const PrintStatementGenerator = require('./print-statement-generator');
const PrintStatementSourceBuilder = require('./print-statement-source-builder');
const TextBuffer = require('./text-buffer');

class AppFactory {

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

module.exports = AppFactory;
