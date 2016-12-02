
const PrintStatementSourceBuilder = require('../../lib/print-statement-source-builder');

suite('PrintStatementSourceBuilder', () => {

    test('it returns a template config for the specified language', () => {
        const config = {KNOWN_LANGUAGE: {template: 'TEMPLATE', escapeRules: 'ESCAPE_RULES'}};
        const workspace = fakeWorkspace(config);
        const selectedExpression = 'SELECTED_EXPRESSION';
        const printStatementSourceBuilder = new PrintStatementSourceBuilder({workspace}).build('KNOWN_LANGUAGE', selectedExpression);
        expect(printStatementSourceBuilder).to.eql({
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'TEMPLATE',
            escapeRules: 'ESCAPE_RULES'
        });
    });

    test('it returns default template if one is not defined for the specified language', () => {
        const config = {
            KNOWN_LANGUAGE: {template: null},
            default: {template: 'DEFAULT_TEMPLATE'}
        };
        const workspace = fakeWorkspace(config);
        const selectedExpression = 'SELECTED_EXPRESSION';
        const printStatementSourceBuilder = new PrintStatementSourceBuilder({workspace}).build('KNOWN_LANGUAGE', selectedExpression);
        expect(printStatementSourceBuilder).to.eql({
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'DEFAULT_TEMPLATE',
            escapeRules: []
        });
    });

    test('it returns default config\'s "templateForNoExpression" if one is not defined for the specified language', () => {
        const config = {
            KNOWN_LANGUAGE: {template: 'KNOWN_LANGUAGE_TEMPLATE'},
            default: {templateForNoExpression: 'DEFAULT_TEMPLATE_FOR_NO_EXPRESSION'}
        };
        const workspace = fakeWorkspace(config);
        const selectedExpression = undefined;
        const printStatementSourceBuilder = new PrintStatementSourceBuilder({workspace}).build('KNOWN_LANGUAGE', selectedExpression);
        expect(printStatementSourceBuilder).to.eql({
            selectedExpression: undefined,
            template: 'DEFAULT_TEMPLATE_FOR_NO_EXPRESSION',
            escapeRules: []
        });
    });

    test('it sets an empty list for escapeRules if it is not specified', () => {
        const config = {KNOWN_LANGUAGE: {template: 'TEMPLATE'}};
        const workspace = fakeWorkspace(config);
        const selectedExpression = 'SELECTED_EXPRESSION';
        const printStatementSourceBuilder = new PrintStatementSourceBuilder({workspace}).build('KNOWN_LANGUAGE', selectedExpression);
        expect(printStatementSourceBuilder).to.eql({
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'TEMPLATE',
            escapeRules: []
        });
    });

    function fakeWorkspace(templates) {
        templates = templates || {};
        const stub = sinon.stub();
        Object.keys(templates).forEach(languageId => {
            stub.withArgs(`printStatement.${languageId}`).returns(templates[languageId]);
        });
        return {getConfiguration: sinon.stub().returns({get: stub})};
    }
});
