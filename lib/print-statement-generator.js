
'use strict';

const COUNT_PLACEHOLDER = '{{count}}';
const EXPRESSION_ESCAPE_PLACEHOLDER = '{{selectedExpression|escape}}';
const EXPRESSION_PLACEHOLDER = '{{selectedExpression}}';

class PrintStatementGenerator {
    constructor(params) {
        this._printStatementCounter = params.printStatementCounter;
    }

    generate(params) {
        const selectedExpression = params.selectedExpression || '';
        const escapedSelectedExpression = this._replaceWithRules(selectedExpression, params.escapeRules);
        const replacePairs = this._getReplacePairs(selectedExpression, escapedSelectedExpression);
        return this._replaceWithRules(params.template, replacePairs);
    }

    _getReplacePairs(selectedText, escapedSelectedText) {
        return [
            [COUNT_PLACEHOLDER, this._printStatementCounter.getAndIncrement()],
            [EXPRESSION_PLACEHOLDER, selectedText],
            [EXPRESSION_ESCAPE_PLACEHOLDER, escapedSelectedText]
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

module.exports = PrintStatementGenerator;
