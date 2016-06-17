
const App = require('../../lib/app');

suite('App', () => {

    test('it replaces the selected text with a print statement', () => {
        const selection = {text: 'SELECTED_TEXT', isEmpty: false};
        const editor = fakeEditor(selection, 'KNOWN_LANGUGAGE');
        const templateConfigProvider = {get: stubWithArgs(['KNOWN_LANGUGAGE'], 'LANGUAGE_CONFIG')};
        const printStatementBuilder = {build: stubWithArgs(['LANGUAGE_CONFIG', 'SELECTED_TEXT'], 'PRINT_STATEMENT')};
        const logger = getLogger();
        new App({printStatementBuilder, templateConfigProvider, logger}).execute(editor);
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
    });

    test('it does nothing if text is not selected', () => {
        const selection = {text: '', isEmpty: true};
        const editor = fakeEditor(selection);
        new App({}).execute(editor);
        expect(editor.document.getText.callCount).to.eql(0);
        expect(editor._editBuilder.replace.callCount).to.eql(0);
    });

    test('it prints callstack if unhandled exception occurred', () => {
        const selection = {};
        const templateConfigProvider = {get: sinon.stub().throws(new Error('TEMPLATE_CONFIG_PROVIDER_ERROR'))};
        const logger = {error: sinon.spy()};
        new App({templateConfigProvider, logger}).execute(fakeEditor(selection));
        expect(logger.error.args[0][0]).to.have.string('Error: TEMPLATE_CONFIG_PROVIDER_ERROR');
    });

    function fakeEditor(selection, languageId) {
        return {
            selection: selection,
            document: {
                getText: sinon.stub().returns(selection.text),
                languageId: languageId
            },
            edit: function (callback) {
                callback(this._editBuilder);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }

    function stubWithArgs() {
        'use strict';

        const args = Array.prototype.slice.call(arguments);
        const stub = sinon.stub();
        for (let i = 0; i + 1 < args.length; i += 2) {
            stub.withArgs.apply(stub, args[i]).returns(args[i + 1]);
        }
        return stub;
    }

    function getLogger() {
        return console;
    }
});
