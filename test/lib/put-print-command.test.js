
const expect = require('chai').expect;
const sinon = require('sinon');

const PutPrintCommand = require('../../lib/put-print-command');

suite('PutPrintCommand', () => {

    test('The command replaces the selected text with a print statement', () => {
        const selection = {text: 'TEXT', isEmpty: false};
        const editor = dummyEditor(selection);
        new PutPrintCommand({editor}).execute();
        expect(editor.document.getText.args).to.eql([[selection]]);
        expect(editor._editBuilder.replace.args).to.eql([[
            selection, "console('SELECTED_TEXT:', SELECTED_TEXT);"
        ]]);
    });

    test('The command does nothing if text is not selected', () => {
        const selection = {text: '', isEmpty: true};
        const editor = dummyEditor(selection);
        new PutPrintCommand({editor}).execute();
        expect(editor.document.getText.callCount).to.eql(0);
        expect(editor._editBuilder.replace.callCount).to.eql(0);
    });

    function dummyEditor(selection) {
        return {
            selection: selection,
            document: {getText: sinon.stub().returns('SELECTED_TEXT')},
            edit: function (callback) {
                callback(this._editBuilder);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }
});