
'use strict';

const COUNT_PLACEHOLDER = '{{count}}';
const SELECTION_ESCAPE_PLACEHOLDER = '{{selection|escape}}';
const SELECTION_PLACEHOLDER = '{{selection}}';

class PrintStatementBuilder {
    constructor(params) {
        this._printStatementCounter = params.printStatementCounter;
    }

    build(templateConfig, selectedText) {
        const template = templateConfig.template;
        const escapedSelectedText = this._replaceWithRules(selectedText, templateConfig.escapeRules || []);
        const replacePairs = this._getReplacePairs(selectedText, escapedSelectedText);
        return this._replaceWithRules(template, replacePairs);
    }

    _getReplacePairs(selectedText, escapedSelectedText) {
        return [
            [COUNT_PLACEHOLDER, this._printStatementCounter.getAndIncrement()],
            [SELECTION_PLACEHOLDER, selectedText],
            [SELECTION_ESCAPE_PLACEHOLDER, escapedSelectedText]
        ];
    }

    _replaceWithRules(text, replaceRules) {
        const firstRule = replaceRules[0];
        if (!firstRule) return text;

        return text.split(firstRule[0])
            .map(subtext => this._replaceWithRules(subtext, replaceRules.slice(1)))
            .join(firstRule[1]);
    }
}

module.exports = PrintStatementBuilder;
