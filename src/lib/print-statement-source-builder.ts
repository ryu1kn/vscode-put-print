import * as vscode from 'vscode';

export type EscapeRule = [string, string];

export type LanguageConfig = {
    template?: string;
    templateForNoExpression?: string;
    escapeRules?: EscapeRule[]
};

export type PrintStatementSource = {
    selectedExpression?: string;
    template: string;
    escapeRules: EscapeRule[];
};

export default class PrintStatementSourceBuilder {
    private readonly extensionConfig: vscode.WorkspaceConfiguration;

    constructor(workspace: typeof vscode.workspace) {
        this.extensionConfig = workspace.getConfiguration('putprint');
    }

    build(languageId: string, selectedExpression?: string): PrintStatementSource {
        const langConfig = this.extensionConfig.get(`printStatement.${languageId}`) as LanguageConfig;
        const defaultConfig = this.extensionConfig.get('printStatement.default') as LanguageConfig;
        const templateName = selectedExpression ? 'template' : 'templateForNoExpression';
        const config = this.isValidConfig(langConfig, templateName) ? langConfig : defaultConfig;
        return {
            selectedExpression,
            template: config[templateName]!,
            escapeRules: config.escapeRules || []
        };
    }

    private isValidConfig(config: LanguageConfig, templateName: 'template' | 'templateForNoExpression'): boolean {
        const template = config && config[templateName];
        return typeof template === 'string' && template.length > 0;
    }

}
