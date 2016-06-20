
'use strict';

const App = require('./app');
const PrintStatementCounter = require('./print-statement-counter');
const PrintStatementBuilder = require('./print-statement-builder');
const TemplateConfigProvider = require('./template-config-provider');
const TextBuffer = require('./text-buffer');

class AppFactory {

    create(vsWorkspace, logger) {
        const printStatementCounter = new PrintStatementCounter();
        const printStatementBuilder = new PrintStatementBuilder({printStatementCounter});
        const templateConfigProvider = new TemplateConfigProvider({workspace: vsWorkspace});
        const textBuffer = new TextBuffer();
        return new App({printStatementBuilder, templateConfigProvider, textBuffer, logger});
    }

}

module.exports = AppFactory;
