
'use strict';

const App = require('./app');
const PrintStatementBuilder = require('./print-statement-builder');
const TemplateConfigProvider = require('./template-config-provider');

class AppFactory {

    create(vsWorkspace, logger) {
        const printStatementBuilder = new PrintStatementBuilder();
        const templateConfigProvider = new TemplateConfigProvider({workspace: vsWorkspace});
        return new App({printStatementBuilder, templateConfigProvider, logger});
    }

}

module.exports = AppFactory;

