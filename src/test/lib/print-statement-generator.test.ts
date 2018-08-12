import * as assert from 'assert';
import PrintStatementGenerator from '../../lib/print-statement-generator';
import PrintStatementCounter from '../../lib/print-statement-counter';
import {mock, mockMethods, verify, when} from '../helper';
import {EscapeRule} from '../../lib/print-statement-source-builder';

suite('PrintStatementGenerator', () => {

    const printStatementCounter = mock(PrintStatementCounter);
    when(printStatementCounter.getAndIncrement()).thenReturn(0);

    test('it replaces the selected expression with a print statement', () => {
        const printStatementSource = {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: "console.log('{{selectedExpression}}:', {{selectedExpression}});",
            escapeRules: []
        };
        const printStatement = new PrintStatementGenerator(printStatementCounter).generate(printStatementSource);
        assert.deepEqual(printStatement, "console.log('SELECTED_EXPRESSION:', SELECTED_EXPRESSION);");
    });

    test('it behaves as if an empty string is selected if no text is selected', () => {
        const printStatementSource = {
            selectedExpression: undefined,
            template: "console.log('Checking {{selectedExpression}}...');",
            escapeRules: []
        };
        const printStatement = new PrintStatementGenerator(printStatementCounter).generate(printStatementSource);
        assert.deepEqual(printStatement, "console.log('Checking ...');");
    });

    test('it escapes the expression when injecting into a template if "|escape" is specified', () => {
        const printStatementSource = {
            selectedExpression: "fn('TEXT')",
            template: "console.log('{{selectedExpression|escape}}:', {{selectedExpression}});",
            escapeRules: [["'", "\\'"]] as EscapeRule[]
        };
        const printStatement = new PrintStatementGenerator(printStatementCounter).generate(printStatementSource);
        assert.deepEqual(printStatement, "console.log('fn(\\'TEXT\\'):', fn('TEXT'));");
    });

    test("it won't replace the variable parts more than once", () => {
        const printStatementSource = {
            selectedExpression: '{{selectedExpression}}{{selectedExpression}}',
            template: '{{selectedExpression|escape}}',
            escapeRules: [["'", "\\'"]] as EscapeRule[]
        };
        const printStatement = new PrintStatementGenerator(printStatementCounter).generate(printStatementSource);
        assert.deepEqual(printStatement, '{{selectedExpression}}{{selectedExpression}}');
    });

    test('it replaces {{count}} placeholder in the template with a count value', () => {
        const printStatementSource = {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'DEBUG-{{count}}',
            escapeRules: []
        };
        const printStatementCounter = mock(PrintStatementCounter);
        when(printStatementCounter.getAndIncrement()).thenReturn(4);
        const printStatementGenerator = new PrintStatementGenerator(printStatementCounter);
        const printStatement = printStatementGenerator.generate(printStatementSource);
        assert.deepEqual(printStatement, 'DEBUG-4');
    });

    test("it won't increment the counter if {{count}} placeholder doesn't appear in the template", () => {
        const printStatementSource = {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'TEMPLATE_WITH_NO_COUNTER',
            escapeRules: []
        };
        const printStatementCounter = mockMethods<PrintStatementCounter>(['getAndIncrement']);
        const printStatementGenerator = new PrintStatementGenerator(printStatementCounter);
        printStatementGenerator.generate(printStatementSource);
        verify(printStatementCounter.getAndIncrement(), {times: 0});
    });
});
