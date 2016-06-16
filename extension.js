'use strict';

const vscode = require('vscode');
const PrintStatementBuilder = require('./lib/print-statement-builder');
const PutPrintCommand = require('./lib/put-print-command');
const TemplateConfigProvider = require('./lib/template-config-provider');

exports.activate = context => {
    const printStatementBuilder = new PrintStatementBuilder();
    const templateConfigProvider = new TemplateConfigProvider({workspace: vscode.workspace});
    const logger = console;
    const putPrintCommand = new PutPrintCommand({printStatementBuilder, templateConfigProvider, vscode, logger});
    const disposable = vscode.commands.registerCommand(
        'extension.putPrintStatement',
        putPrintCommand.execute.bind(putPrintCommand)
    );
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
