import PrintStatementCounter from './print-statement-counter';

const COUNT_PLACEHOLDER = '{{count}}';
const EXPRESSION_ESCAPE_PLACEHOLDER = '{{selectedExpression|escape}}';
const EXPRESSION_PLACEHOLDER = '{{selectedExpression}}';

export default class PrintStatementGenerator {
    private _printStatementCounter: PrintStatementCounter;

    constructor(params) {
        this._printStatementCounter = params.printStatementCounter;
    }

    generate(params) {
        const selectedExpression = params.selectedExpression || '';
        const escapedSelectedExpression = this._replaceWithRules(selectedExpression, params.escapeRules);
        const isCountUsed = params.template.includes(COUNT_PLACEHOLDER);
        const replacePairs = this._getReplacePairs(selectedExpression, escapedSelectedExpression, isCountUsed);
        return this._replaceWithRules(params.template, replacePairs);
    }

    _getReplacePairs(selectedText, escapedSelectedText, isCountUsed) {
        const countReplacePair = isCountUsed ?
            [COUNT_PLACEHOLDER, this._printStatementCounter.getAndIncrement()] : [];
        return [
            [EXPRESSION_PLACEHOLDER, selectedText],
            [EXPRESSION_ESCAPE_PLACEHOLDER, escapedSelectedText]
        ].concat([countReplacePair]);
    }

    _replaceWithRules(text, replaceRules) {
        const firstRule = replaceRules[0];
        if (!firstRule) return text;

        return text.split(firstRule[0])
            .map(subtext => this._replaceWithRules(subtext, replaceRules.slice(1)))
            .join(firstRule[1]);
    }

}
