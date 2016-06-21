
'use strict';

const App = require('./app');
const CounterInputBox = require('./counter-input-box');
const PrintStatementCounter = require('./print-statement-counter');
const PrintStatementBuilder = require('./print-statement-builder');
const TemplateConfigProvider = require('./template-config-provider');
const TextBuffer = require('./text-buffer');

class AppFactory {

    create(vscode, logger) {
        const counterInputBox = new CounterInputBox({window: vscode.window});
        const printStatementCounter = new PrintStatementCounter();
        const printStatementBuilder = new PrintStatementBuilder({printStatementCounter});
        const templateConfigProvider = new TemplateConfigProvider({workspace: vscode.workspace});
        const textBuffer = new TextBuffer();
        return new App({
            counterInputBox,
            printStatementBuilder,
            printStatementCounter,
            templateConfigProvider,
            textBuffer,
            logger
        });
    }

}

module.exports = AppFactory;
