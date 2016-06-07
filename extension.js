'use strict';

const vscode = require('vscode');
const PutPrintCommand = require('./lib/put-print-command');

exports.activate = context => {
    const editor = vscode.window.activeTextEditor;
    const putPrintCommand = new PutPrintCommand({editor});
    const disposable = vscode.commands.registerCommand(
        'extension.putPrintStatement',
        putPrintCommand.execute.bind(putPrintCommand)
    );
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};