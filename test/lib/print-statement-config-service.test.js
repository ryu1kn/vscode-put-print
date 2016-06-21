
const PrintStatementConfigService = require('../../lib/print-statement-config-service');

suite('PrintStatementConfigService', () => {

    test('it returns a template config for the specified language', () => {
        const config = {KNOWN_LANGUAGE: {template: 'TEMPLATE', escapeRules: 'ESCAPE'}};
        const workspace = fakeWorkspace(config);
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE');
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: 'ESCAPE'});
    });

    test('it returns a default template config if there is no config for the specified language', () => {
        const config = {default: {template: 'TEMPLATE', escapeRules: 'ESCAPE'}};
        const workspace = fakeWorkspace(config);
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('UNKNOWN_LANGUAGE');
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: 'ESCAPE'});
    });

    test('it sets an empty list for escapeRules if it is not specified', () => {
        const config = {KNOWN_LANGUAGE: {template: 'TEMPLATE'}};
        const workspace = fakeWorkspace(config);
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE');
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: []});
    });

    test('it returns default config instead of the one for the specific if template string is not given', () => {
        const config = {
            KNOWN_LANGUAGE: {template: null},
            default: {template: 'DEFAULT_TEMPLATE'}
        };
        const workspace = fakeWorkspace(config);
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('KNOWN_LANGUAGE');
        expect(printStatementConfig).to.eql({template: 'DEFAULT_TEMPLATE', escapeRules: []});
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
