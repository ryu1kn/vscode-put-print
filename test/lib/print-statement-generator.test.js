
const PrintStatementGenerator = require('../../lib/print-statement-generator');

suite('PrintStatementGenerator', () => {

    test('it replaces the selected expression with a print statement', () => {
        const printStatementSource = {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: "console.log('{{selectedExpression}}:', {{selectedExpression}});",
            escapeRules: []
        };
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementGenerator({printStatementCounter}).generate(printStatementSource);
        expect(printStatement).to.eql("console.log('SELECTED_EXPRESSION:', SELECTED_EXPRESSION);");
    });

    test('it escapes the expression when injecting into a template if "|escape" is specified', () => {
        const printStatementSource = {
            selectedExpression: "fn('TEXT')",
            template: "console.log('{{selectedExpression|escape}}:', {{selectedExpression}});",
            escapeRules: [["'", "\\'"]]
        };
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementGenerator({printStatementCounter}).generate(printStatementSource);
        expect(printStatement).to.eql("console.log('fn(\\'TEXT\\'):', fn('TEXT'));");
    });

    test("it won't replace the variable parts more than once", () => {
        const printStatementSource = {
            selectedExpression: '{{selectedExpression}}{{selectedExpression}}',
            template: '{{selectedExpression|escape}}',
            escapeRules: [["'", "\\'"]]
        };
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementGenerator({printStatementCounter}).generate(printStatementSource);
        expect(printStatement).to.eql('{{selectedExpression}}{{selectedExpression}}');
    });

    test('it replaces {{count}} placeholder in the template with a count value', () => {
        const printStatementSource = {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'DEBUG-{{count}}',
            escapeRules: []
        };
        const printStatementCounter = {getAndIncrement: () => 4};
        const printStatementGenerator = new PrintStatementGenerator({printStatementCounter});
        const printStatement = printStatementGenerator.generate(printStatementSource);
        expect(printStatement).to.eql('DEBUG-4');
    });
});
