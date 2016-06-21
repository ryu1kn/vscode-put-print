
'use strict';

const EXTENSION_NAMESPACE = 'putprint';

class AppIntegrator {
    constructor(params) {
        this._app = params.app;
        this._vscode = params.vscode;
    }

    integrate(context) {
        this._registerTextEditorCommands(context);
        this._registerCommands(context);
    }

    _registerTextEditorCommands(context) {
        const app = this._app;
        const commandMap = new Map([
            [`${EXTENSION_NAMESPACE}.putPrintStatement`, app.putPrintStatement.bind(app)],
            [`${EXTENSION_NAMESPACE}.selectExpression`, app.selectExpression.bind(app)]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerTextEditorCommand(commandName, command);
            context.subscriptions.push(disposable);
        });
    }

    _registerCommands(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerCommand(
                `${EXTENSION_NAMESPACE}.resetCounter`, app.resetCounter.bind(app));
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
