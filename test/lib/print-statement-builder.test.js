
const PrintStatementBuilder = require('../../lib/print-statement-builder');

suite('PrintStatementBuilder', () => {

    test('it replaces the selected text with a print statement', () => {
        const printStatementConfig = {
            template: "console.log('{{selectedExpression}}:', {{selectedExpression}});",
            escapeRules: []
        };
        const selectedExpression = 'SELECTED_EXPRESSION';
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementBuilder({printStatementCounter}).build(selectedExpression, printStatementConfig);
        expect(printStatement).to.eql("console.log('SELECTED_EXPRESSION:', SELECTED_EXPRESSION);");
    });

    test('it escapes the text when injecting into a template if "|escape" is specified', () => {
        const printStatementConfig = {
            template: "console.log('{{selectedExpression|escape}}:', {{selectedExpression}});",
            escapeRules: [["'", "\\'"]]
        };
        const selectedExpression = "fn('TEXT')";
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementBuilder({printStatementCounter}).build(selectedExpression, printStatementConfig);
        expect(printStatement).to.eql("console.log('fn(\\'TEXT\\'):', fn('TEXT'));");
    });

    test("it won't replace the variable parts more than once", () => {
        const printStatementConfig = {
            template: '{{selectedExpression|escape}}',
            escapeRules: [["'", "\\'"]]
        };
        const selectedExpression = '{{selectedExpression}}{{selectedExpression}}';
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementBuilder({printStatementCounter}).build(selectedExpression, printStatementConfig);
        expect(printStatement).to.eql('{{selectedExpression}}{{selectedExpression}}');
    });

    test('it replaces {{count}} placeholder in the template with a count value', () => {
        const printStatementConfig = {
            template: 'DEBUG-{{count}}',
            escapeRules: []
        };
        const printStatementCounter = {getAndIncrement: () => 4};
        const printStatementBuilder = new PrintStatementBuilder({printStatementCounter});
        const printStatement = printStatementBuilder.build('SELECTED_EXPRESSION', printStatementConfig);
        expect(printStatement).to.eql('DEBUG-4');
    });
});
