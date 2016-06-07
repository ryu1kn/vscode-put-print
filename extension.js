'use strict';

const vscode = require('vscode');
const PutPrintCommand = require('./lib/put-print-command');

exports.activate = context => {
    const putPrintCommand = new PutPrintCommand({vscode, logger: console});
    const disposable = vscode.commands.registerCommand(
        'extension.putPrintStatement',
        putPrintCommand.execute.bind(putPrintCommand)
    );
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};