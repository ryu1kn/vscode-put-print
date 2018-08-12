import * as vscode from 'vscode';

type EscapeRule = [string, string];

type LanguageConfig = {
    template: string;
    templateForNoExpression: string;
    escapeRules: EscapeRule[]
};

export default class PrintStatementSourceBuilder {
    private _extensionConfig: vscode.WorkspaceConfiguration;

    constructor(params) {
        this._extensionConfig = params.workspace.getConfiguration('putprint');
    }

    build(languageId, selectedExpression) {
        const langConfig = this._extensionConfig.get(`printStatement.${languageId}`) as LanguageConfig;
        const defaultConfig = this._extensionConfig.get('printStatement.default') as LanguageConfig;
        const templateName = selectedExpression ? 'template' : 'templateForNoExpression';
        const config = this._isValidConfig(langConfig, templateName) ? langConfig : defaultConfig;
        return {
            selectedExpression,
            template: config[templateName],
            escapeRules: config.escapeRules || []
        };
    }

    _isValidConfig(config, templateName) {
        const template = config && config[templateName];
        return typeof template === 'string' && template.length > 0;
    }

}
