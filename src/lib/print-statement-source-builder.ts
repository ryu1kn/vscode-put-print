import * as vscode from 'vscode';

type EscapeRule = [string, string];

type LanguageConfig = {
    template: string;
    templateForNoExpression: string;
    escapeRules: EscapeRule[]
};

export default class PrintStatementSourceBuilder {
    private readonly extensionConfig: vscode.WorkspaceConfiguration;

    constructor(params) {
        this.extensionConfig = params.workspace.getConfiguration('putprint');
    }

    build(languageId, selectedExpression) {
        const langConfig = this.extensionConfig.get(`printStatement.${languageId}`) as LanguageConfig;
        const defaultConfig = this.extensionConfig.get('printStatement.default') as LanguageConfig;
        const templateName = selectedExpression ? 'template' : 'templateForNoExpression';
        const config = this.isValidConfig(langConfig, templateName) ? langConfig : defaultConfig;
        return {
            selectedExpression,
            template: config[templateName],
            escapeRules: config.escapeRules || []
        };
    }

    private isValidConfig(config, templateName) {
        const template = config && config[templateName];
        return typeof template === 'string' && template.length > 0;
    }

}
