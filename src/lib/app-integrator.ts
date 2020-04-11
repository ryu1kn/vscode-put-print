import App from './app';
import * as vscode from 'vscode';

const EXTENSION_NAMESPACE = 'putprint';

export default class AppIntegrator {

    constructor(private readonly app: App, private readonly vscode: any) {}

    integrate(context: vscode.ExtensionContext) {
        this.registerTextEditorCommands(context);
        this.registerCommands(context);
    }

    private registerTextEditorCommands(context: vscode.ExtensionContext) {
        const app = this.app;
        const commandMap = new Map([
            [`${EXTENSION_NAMESPACE}.putPrintStatement`, app.putPrintStatement.bind(app)],
            [`${EXTENSION_NAMESPACE}.selectExpression`, app.selectExpression.bind(app)]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this.vscode.commands.registerTextEditorCommand(commandName, command);
            context.subscriptions.push(disposable);
        });
    }

    private registerCommands(context: vscode.ExtensionContext) {
        const app = this.app;
        const disposable = this.vscode.commands.registerCommand(
            `${EXTENSION_NAMESPACE}.resetCounter`, app.resetCounter.bind(app));
        context.subscriptions.push(disposable);
    }

}
