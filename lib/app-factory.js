
'use strict';

const App = require('./app');
const PrintStatementBuilder = require('./print-statement-builder');
const TemplateConfigProvider = require('./template-config-provider');
const TextBuffer = require('./text-buffer');

class AppFactory {

    create(vsWorkspace, logger) {
        const printStatementBuilder = new PrintStatementBuilder();
        const templateConfigProvider = new TemplateConfigProvider({workspace: vsWorkspace});
        const textBuffer = new TextBuffer();
        return new App({printStatementBuilder, templateConfigProvider, textBuffer, logger});
    }

}

module.exports = AppFactory;
