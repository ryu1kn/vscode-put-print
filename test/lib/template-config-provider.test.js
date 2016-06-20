
const TemplateConfigProvider = require('../../lib/template-config-provider');

suite('TemplateConfigProvider', () => {

    test('it returns a template config for the specified language', () => {
        const config = {javascript: {template: 'TEMPLATE', escape: 'ESCAPE'}};
        const workspace = fakeWorkspace(config);
        const templateConfig = new TemplateConfigProvider({workspace}).get('javascript');
        expect(templateConfig).to.eql({template: 'TEMPLATE', escape: 'ESCAPE'});
    });

    test('it returns a default template config if there is no config for the specified language', () => {
        const config = {default: {template: 'TEMPLATE', escape: 'ESCAPE'}};
        const workspace = fakeWorkspace(config);
        const templateConfig = new TemplateConfigProvider({workspace}).get('UNKNOWN_LANGUAGE');
        expect(templateConfig).to.eql({template: 'TEMPLATE', escape: 'ESCAPE'});
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
