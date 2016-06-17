
const App = require('../../lib/app');

suite('App', () => {

    suite('#saveText', () => {

        test('saves selected text to a buffer', () => {
            const editor = fakeEditor('SELECTED_TEXT', 'LANGUAGE_ID');
            const textBuffer = {write: sinon.spy()};
            new App({textBuffer}).saveText(editor);
        });
    });

    test('it replaces the selected text with a print statement composed from saved text', () => {
        const selection = {text: 'TEXT_TO_REPLACE', isEmpty: false};
        const editor = fakeEditor(selection.text, 'LANGUAGE_ID');
        const templateConfigProvider = {get: stubWithArgs(['LANGUAGE_ID'], 'LANGUAGE_CONFIG')};
        const printStatementBuilder = {build: stubWithArgs(['LANGUAGE_CONFIG', 'SAVED_TEXT'], 'PRINT_STATEMENT')};
        const textBuffer = {read: sinon.stub().returns('SAVED_TEXT')};
        const logger = getLogger();
        new App({printStatementBuilder, templateConfigProvider, textBuffer, logger}).putPrintStatement(editor);
        expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
    });

    test('it prints callstack if unhandled exception occurred', () => {
        const templateConfigProvider = {get: sinon.stub().throws(new Error('TEMPLATE_CONFIG_PROVIDER_ERROR'))};
        const logger = {error: sinon.spy()};
        new App({templateConfigProvider, logger}).putPrintStatement(fakeEditor('SELECTED_TEXT'));
        expect(logger.error.args[0][0]).to.have.string('Error: TEMPLATE_CONFIG_PROVIDER_ERROR');
    });

    function fakeEditor(selectedText, languageId) {
        return {
            selection: {
                text: selectedText,
                isEmpty: !selectedText
            },
            document: {
                getText: sinon.stub().returns(selectedText),
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
