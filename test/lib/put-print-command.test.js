
const PutPrintCommand = require('../../lib/put-print-command');

suite('PutPrintCommand', () => {

    test('it replaces the selected text with a print statement', () => {
        const selection = {text: 'SELECTED_TEXT', isEmpty: false};
        const templates = {javascript: 'TEMPLATE'};
        const editor = fakeEditor(selection, 'KNOWN_LANGUGAGE');
        const vscode = fakeVscode(editor, templates);
        const templateConfigProvider = {get: stubWithArgs(['KNOWN_LANGUGAGE'], 'LANGUAGE_CONFIG')}
        const printStatementBuilder = {build: stubWithArgs(['LANGUAGE_CONFIG', 'SELECTED_TEXT'], 'PRINT_STATEMENT')};
        const logger = getLogger();
        new PutPrintCommand({printStatementBuilder, templateConfigProvider, vscode, logger}).execute();
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
    });

    test('it does nothing if text is not selected', () => {
        const selection = {text: '', isEmpty: true};
        const editor = fakeEditor(selection);
        const vscode = fakeVscode(editor);
        new PutPrintCommand({vscode}).execute();
        expect(editor.document.getText.callCount).to.eql(0);
        expect(editor._editBuilder.replace.callCount).to.eql(0);
    });

    test('it prints callstack if unhandled exception occurred', () => {
        const selection = {};
        const editor = fakeEditor(selection);
        const vscode = fakeVscode(editor);
        const templateConfigProvider = {get: sinon.stub().throws(new Error('TEMPLATE_CONFIG_PROVIDER_ERROR'))};
        const logger = {error: sinon.spy()};
        new PutPrintCommand({templateConfigProvider, vscode, logger}).execute();
        expect(logger.error.args[0][0]).to.have.string('Error: TEMPLATE_CONFIG_PROVIDER_ERROR');
    });

    function fakeVscode(editor, templates) {
        return {
            window: {activeTextEditor: editor},
            workspace: fakeWorkspace(templates)
        };
    }

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

    function fakeWorkspace(templates) {
        templates = templates || {};
        const stub = sinon.stub();
        Object.keys(templates).forEach(languageId => {
            stub.withArgs(`printTemplate.${languageId}`).returns(templates[languageId]);
        });
        return {getConfiguration: sinon.stub().returns({get: stub})};
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
