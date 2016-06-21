
'use strict';

class PrintStatementConfigService {
    constructor(params) {
        this._extensionConfig = params.workspace.getConfiguration('putprint');
    }

    get(languageId) {
        return this._extensionConfig.get(`printStatement.${languageId}`) ||
               this._extensionConfig.get('printStatement.default');
    }
}

module.exports = PrintStatementConfigService;
