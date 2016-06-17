'use strict';

const vscode = require('vscode');
const App = require('./lib/app');
const PrintStatementBuilder = require('./lib/print-statement-builder');
const TemplateConfigProvider = require('./lib/template-config-provider');

exports.activate = context => {
    const printStatementBuilder = new PrintStatementBuilder();
    const templateConfigProvider = new TemplateConfigProvider({workspace: vscode.workspace});
    const logger = console;
    const app = new App({printStatementBuilder, templateConfigProvider, logger});
    const disposable = vscode.commands.registerTextEditorCommand(
        'extension.putPrintStatement', app.execute.bind(app)
    );
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
