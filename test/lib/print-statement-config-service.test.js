
const PrintStatementConfigService = require('../../lib/print-statement-config-service');

suite('PrintStatementConfigService', () => {

    test('it returns a template config for the specified language', () => {
        const config = {javascript: {template: 'TEMPLATE', escapeRules: 'ESCAPE'}};
        const workspace = fakeWorkspace(config);
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('javascript');
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: 'ESCAPE'});
    });

    test('it returns a default template config if there is no config for the specified language', () => {
        const config = {default: {template: 'TEMPLATE', escapeRules: 'ESCAPE'}};
        const workspace = fakeWorkspace(config);
        const printStatementConfig = new PrintStatementConfigService({workspace}).get('UNKNOWN_LANGUAGE');
        expect(printStatementConfig).to.eql({template: 'TEMPLATE', escapeRules: 'ESCAPE'});
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
