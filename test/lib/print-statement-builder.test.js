
const PrintStatementBuilder = require('../../lib/print-statement-builder');

suite('PrintStatementBuilder', () => {

    test('it replaces the selected text with a print statement', () => {
        const templateConfig = {
            template: "console.log('{{selection}}:', {{selection}});"
        };
        const selectedText = 'SELECTED_TEXT';
        const printStatement = new PrintStatementBuilder().build(templateConfig, selectedText);
        expect(printStatement).to.eql("console.log('SELECTED_TEXT:', SELECTED_TEXT);");
    });

    test('it escapes the text when injecting into a template if "|escape" is specified', () => {
        const templateConfig = {
            template: "console.log('{{selection|escape}}:', {{selection}});",
            escape: [["'", "\\'"]]
        };
        const selectedText = "fn('TEXT')";
        const printStatement = new PrintStatementBuilder().build(templateConfig, selectedText);
        expect(printStatement).to.eql("console.log('fn(\\'TEXT\\'):', fn('TEXT'));");
    });

    test("it won't replace the variable parts more than once", () => {
        const templateConfig = {
            template: '{{selection|escape}}',
            escape: [["'", "\\'"]]
        };
        const selectedText = '{{selection}}{{selection}}';
        const printStatement = new PrintStatementBuilder().build(templateConfig, selectedText);
        expect(printStatement).to.eql('{{selection}}{{selection}}');
    });
});
