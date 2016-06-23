
const PrintStatementConfigService = require('../../lib/print-statement-config-service');

suite('PrintStatementConfigService', () => {

    test('it returns a template config for the specified language', () => {
        const config = {KNOWN_LANGUAGE: {template: 'TEMPLATE', escapeRules: 'ESCAPE_RULES'}};
        const workspace = fakeWorkspace(config);
        const isExpressionSelected = true;
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE', isExpressionSelected);
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: 'ESCAPE_RULES'});
    });

    test('it returns default template if one is not defined for the specified language', () => {
        const config = {
            KNOWN_LANGUAGE: {template: null},
            default: {template: 'DEFAULT_TEMPLATE'}
        };
        const workspace = fakeWorkspace(config);
        const isExpressionSelected = true;
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE', isExpressionSelected);
        expect(printStatementConfig).to.eql({template: 'DEFAULT_TEMPLATE', escapeRules: []});
    });

    test('it returns default config\'s "templateForNoExpression" if one is not defined for the specified language', () => {
        const config = {
            KNOWN_LANGUAGE: {template: 'KNOWN_LANGUAGE_TEMPLATE'},
            default: {templateForNoExpression: 'DEFAULT_TEMPLATE_FOR_NO_EXPRESSION'}
        };
        const workspace = fakeWorkspace(config);
        const isExpressionSelected = false;
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE', isExpressionSelected);
        expect(printStatementConfig).to.eql({template: 'DEFAULT_TEMPLATE_FOR_NO_EXPRESSION', escapeRules: []});
    });

    test('it sets an empty list for escapeRules if it is not specified', () => {
        const config = {KNOWN_LANGUAGE: {template: 'TEMPLATE'}};
        const workspace = fakeWorkspace(config);
        const isExpressionSelected = true;
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE', isExpressionSelected);
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: []});
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
