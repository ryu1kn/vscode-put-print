
const PutPrintCommand = require('../../lib/put-print-command');

suite('PutPrintCommand', () => {

    test('it replaces the selected text with a print statement', () => {
        const selection = {text: 'SELECTED_TEXT', isEmpty: false};
        const templates = {javascript: 'TEMPLATE'};
        const editor = fakeEditor(selection, 'javascript');
        const vscode = fakeVscode(editor, templates);
        const printStatementBuilder = {build: buildStub(['TEMPLATE', 'SELECTED_TEXT'], 'PRINT_STATEMENT')};
        new PutPrintCommand({printStatementBuilder, vscode}).execute();
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
        expect(vscode.workspace.getConfiguration.args).to.eql([['putprint']]);
    });

    test('it does nothing if text is not selected', () => {
        const selection = {text: '', isEmpty: true};
        const editor = fakeEditor(selection);
        const vscode = fakeVscode(editor);
        new PutPrintCommand({vscode}).execute();
        expect(editor.document.getText.callCount).to.eql(0);
        expect(editor._editBuilder.replace.callCount).to.eql(0);
    });

    test('it uses the default template if there is no template specified for the current language', () => {
        const selection = {text: 'SELECTED_TEXT', isEmpty: false};
        const editor = fakeEditor(selection, 'UNKNOWN_LANGUAGE');
        const templates = {default: 'TEMPLATE'};
        const vscode = fakeVscode(editor, templates);
        const printStatementBuilder = {build: buildStub(['TEMPLATE', 'SELECTED_TEXT'], 'PRINT_STATEMENT')};
        new PutPrintCommand({printStatementBuilder, vscode}).execute();
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
    });

    test('it prints callstack if unhandled exception occurred', () => {
        const selection = {};
        const editor = fakeEditor(selection);
        const vscode = fakeVscode(editor);
        const logger = {error: sinon.spy()};
        new PutPrintCommand({vscode, logger}).execute();
        expect(logger.error.args[0][0]).to.have.string("TypeError: Cannot read property 'build' of undefined");
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

    function buildStub() {
        'use strict';

        const args = Array.prototype.slice.call(arguments);
        const stub = sinon.stub();
        for (let i = 0; i + 1 < args.length; i += 2) {
            let argsI = args[i];
            let returnI = args[i + 1];
            stub.withArgs.apply(stub, argsI).returns(returnI);
        }
        return stub;
    }

    function getLogger() {
        return console;
    }
});
