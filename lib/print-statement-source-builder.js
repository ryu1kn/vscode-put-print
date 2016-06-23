
'use strict';

class PrintStatementSourceBuilder {
    constructor(params) {
        this._extensionConfig = params.workspace.getConfiguration('putprint');
    }

    build(languageId, isExpressionSelected) {
        const langConfig = this._extensionConfig.get(`printStatement.${languageId}`);
        const defaultConfig = this._extensionConfig.get('printStatement.default');
        const templateName = isExpressionSelected ? 'template' : 'templateForNoExpression';
        const config = this._isValidConfig(langConfig, templateName) ? langConfig : defaultConfig;
        return this._normaliseConfig(config, templateName);
    }

    _isValidConfig(config, templateName) {
        const template = config && config[templateName];
        return typeof template === 'string' && template.length > 0;
    }

    _normaliseConfig(config, templateName) {
        return {
            template: config[templateName],
            escapeRules: config.escapeRules || []
        };
    }
}

module.exports = PrintStatementSourceBuilder;
