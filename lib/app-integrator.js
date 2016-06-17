
'use strict';

const EXTENSION_NAMESPACE = 'extension';

class AppIntegrator {
    constructor(params) {
        this._app = params.app;
        this._vscode = params.vscode;
    }

    integrate(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerTextEditorCommand(
            `${EXTENSION_NAMESPACE}.putPrintStatement`, app.execute.bind(app)
        );
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
