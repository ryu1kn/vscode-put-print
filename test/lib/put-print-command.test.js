
const expect = require('chai').expect;
const sinon = require('sinon');

const PutPrintCommand = require('../../lib/put-print-command');

suite('PutPrintCommand', () => {

    test('it replaces the selected text with a print statement', () => {
        const selection = {text: 'TEXT', isEmpty: false};
        const editor = fakeEditor(selection);
        const vscode = fakeVscode(editor);
        new PutPrintCommand({vscode}).execute();
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[
            selection, "console.log('SELECTED_TEXT:', SELECTED_TEXT);"
        ]]);
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
        const selection = {text: 'TEXT', isEmpty: false};
        const editor = fakeEditor(selection, 'UNKNOWN_LANGUAGE');
        const vscode = fakeVscode(editor);
        new PutPrintCommand({vscode}).execute();
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[
            selection, "_SELECTED_TEXT_"
        ]]);
    });

    test('it prints callstack if unhandled exception happened', () => {
        const selection = null;
        const editor = fakeEditor(selection);
        const vscode = fakeVscode(editor);
        const logger = {error: sinon.spy()};
        new PutPrintCommand({vscode, logger}).execute();
        expect(logger.error.args[0][0]).to.have.string("TypeError: Cannot read property 'isEmpty' of null");
    });

    function fakeVscode(editor) {
        return {
            window: {activeTextEditor: editor},
            workspace: fakeWorkspace()
        };
    }

    function fakeEditor(selection, languageId) {
        return {
            selection: selection,
            document: {
                getText: sinon.stub().returns('SELECTED_TEXT'),
                languageId: languageId || 'javascript'
            },
            edit: function (callback) {
                callback(this._editBuilder);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }

    function fakeWorkspace() {
        const get = sinon.stub();
        get.withArgs('printTemplate.javascript').returns("console.log('{{selection}}:', {{selection}});");
        get.withArgs('printTemplate.default').returns("_{{selection}}_");
        return {getConfiguration: sinon.stub().returns({get})};
    }
});