
const PrintStatementBuilder = require('../../lib/print-statement-builder');

suite('PrintStatementBuilder', () => {

    test('it replaces the selected text with a print statement', () => {
        const templateConfig = {
            template: "console.log('{{selection}}:', {{selection}});"
        };
        const selectedText = 'SELECTED_TEXT';
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementBuilder({printStatementCounter}).build(templateConfig, selectedText);
        expect(printStatement).to.eql("console.log('SELECTED_TEXT:', SELECTED_TEXT);");
    });

    test('it escapes the text when injecting into a template if "|escape" is specified', () => {
        const templateConfig = {
            template: "console.log('{{selection|escape}}:', {{selection}});",
            escapeRules: [["'", "\\'"]]
        };
        const selectedText = "fn('TEXT')";
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementBuilder({printStatementCounter}).build(templateConfig, selectedText);
        expect(printStatement).to.eql("console.log('fn(\\'TEXT\\'):', fn('TEXT'));");
    });

    test("it won't replace the variable parts more than once", () => {
        const templateConfig = {
            template: '{{selection|escape}}',
            escapeRules: [["'", "\\'"]]
        };
        const selectedText = '{{selection}}{{selection}}';
        const printStatementCounter = {getAndIncrement: () => 0};
        const printStatement = new PrintStatementBuilder({printStatementCounter}).build(templateConfig, selectedText);
        expect(printStatement).to.eql('{{selection}}{{selection}}');
    });

    test('it replaces {{count}} placeholder in the template with a count value', () => {
        const templateConfig = {template: 'DEBUG-{{count}}'};
        const printStatementCounter = {getAndIncrement: () => 4};
        const printStatementBuilder = new PrintStatementBuilder({printStatementCounter});
        const printStatement = printStatementBuilder.build(templateConfig, 'SELECTED_TEXT');
        expect(printStatement).to.eql('DEBUG-4');
    });
});
