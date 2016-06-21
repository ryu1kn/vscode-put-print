
'use strict';

class PrintStatementConfigService {
    constructor(params) {
        this._extensionConfig = params.workspace.getConfiguration('putprint');
    }

    get(languageId) {
        const langConfig = this._extensionConfig.get(`printStatement.${languageId}`);
        const defaultConfig = this._extensionConfig.get('printStatement.default');
        const config = this._isValidConfig(langConfig) ? langConfig : defaultConfig;
        return this._normaliseConfig(config);
    }

    _isValidConfig(config) {
        const template = config && config.template;
        return typeof template === 'string' && template.length > 0;
    }

    _normaliseConfig(config) {
        return Object.assign({}, config, {
            escapeRules: config.escapeRules || []
        });
    }
}

module.exports = PrintStatementConfigService;
