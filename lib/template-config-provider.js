
'use strict';

class TemplateConfigProvider {
    constructor(params) {
        this._extensionConfig = params.workspace.getConfiguration('putprint');
    }

    get(languageId) {
        return this._extensionConfig.get(`printTemplate.${languageId}`) ||
               this._extensionConfig.get('printTemplate.default');
    }
}

module.exports = TemplateConfigProvider;
