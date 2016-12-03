
class PrintStatementSourceBuilder {

    constructor(params) {
        this._extensionConfig = params.workspace.getConfiguration('putprint');
    }

    build(languageId, selectedExpression) {
        const langConfig = this._extensionConfig.get(`printStatement.${languageId}`);
        const defaultConfig = this._extensionConfig.get('printStatement.default');
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

module.exports = PrintStatementSourceBuilder;
