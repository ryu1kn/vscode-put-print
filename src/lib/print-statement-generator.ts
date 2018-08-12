import PrintStatementCounter from './print-statement-counter';
import {PrintStatementSource} from './print-statement-source-builder';

const COUNT_PLACEHOLDER = '{{count}}';
const EXPRESSION_ESCAPE_PLACEHOLDER = '{{selectedExpression|escape}}';
const EXPRESSION_PLACEHOLDER = '{{selectedExpression}}';

export default class PrintStatementGenerator {
    private readonly printStatementCounter: PrintStatementCounter;

    constructor(printStatementCounter: PrintStatementCounter) {
        this.printStatementCounter = printStatementCounter;
    }

    generate(params: PrintStatementSource) {
        const selectedExpression = params.selectedExpression || '';
        const escapedSelectedExpression = this.replaceWithRules(selectedExpression, params.escapeRules);
        const isCountUsed = params.template.includes(COUNT_PLACEHOLDER);
        const replacePairs = this.getReplacePairs(selectedExpression, escapedSelectedExpression, isCountUsed);
        return this.replaceWithRules(params.template, replacePairs);
    }

    private getReplacePairs(selectedText, escapedSelectedText, isCountUsed) {
        const countReplacePair = isCountUsed ?
            [COUNT_PLACEHOLDER, this.printStatementCounter.getAndIncrement()] : [];
        return [
            [EXPRESSION_PLACEHOLDER, selectedText],
            [EXPRESSION_ESCAPE_PLACEHOLDER, escapedSelectedText]
        ].concat([countReplacePair]);
    }

    private replaceWithRules(text, replaceRules) {
        const firstRule = replaceRules[0];
        if (!firstRule) return text;

        return text.split(firstRule[0])
            .map(subtext => this.replaceWithRules(subtext, replaceRules.slice(1)))
            .join(firstRule[1]);
    }

}
