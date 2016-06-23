
const App = require('../../lib/app');

suite('App', () => {

    suite('#selectExpression', () => {

        test('saves selected expression to a buffer', () => {
            const editor = fakeEditor('SELECTED_TEXT', 'LANGUAGE_ID');
            const textBuffer = {write: sinon.spy()};
            new App({textBuffer}).selectExpression(editor);
            expect(textBuffer.write).to.have.been.calledWith('SELECTED_TEXT');
        });
    });

    suite('#putPrintStatement', () => {

        test('it replaces the selected text with a print statement composed from a selected expression', () => {
            const selection = {text: 'TEXT_TO_REPLACE', isEmpty: false};
            const editor = fakeEditor(selection.text, 'LANGUAGE_ID');
            const isExpressionSelected = true;
            const printStatementSourceBuilder = {build: stubWithArgs(['LANGUAGE_ID', isExpressionSelected], 'TEMPLATE_CONFIG')};
            const printStatementGenerator = {generate: stubWithArgs(['SAVED_TEXT', 'TEMPLATE_CONFIG'], 'PRINT_STATEMENT')};
            const textBuffer = {read: sinon.stub().returns('SAVED_TEXT')};
            const logger = getLogger();
            const app = new App({printStatementGenerator, printStatementSourceBuilder, textBuffer, logger});
            return app.putPrintStatement(editor).then(() => {
                expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
            });
        });

        test("it puts print statement even if an expression hasn't been selected", () => {
            const selection = {text: 'TEXT_TO_REPLACE', isEmpty: false};
            const editor = fakeEditor(selection.text, 'LANGUAGE_ID');
            const isExpressionSelected = false;
            const printStatementSourceBuilder = {build: stubWithArgs(['LANGUAGE_ID', isExpressionSelected], 'LANGUAGE_CONFIG')};
            const printStatementGenerator = {generate: stubWithArgs([undefined, 'LANGUAGE_CONFIG'], 'PRINT_STATEMENT')};
            const textBuffer = {read: () => {}};
            const logger = getLogger();
            const app = new App({printStatementGenerator, printStatementSourceBuilder, textBuffer, logger});
            return app.putPrintStatement(editor).then(() => {
                expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
            });
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const textBuffer = {read: sinon.stub().throws(new Error('TEXT_BUFFER_ERROR'))};
            const logger = {error: sinon.spy()};
            const app = new App({textBuffer, logger});
            return app.putPrintStatement(fakeEditor('SELECTED_TEXT')).then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: TEXT_BUFFER_ERROR');
            });
        });
    });

    suite('#resetCounter', () => {

        test('it resets the counter value with what counterInputBox returns', () => {
            const logger = getLogger();
            const printStatementCounter = {reset: sinon.spy()};
            const counterInputBox = {read: sinon.stub().returns(Promise.resolve(24))};
            const app = new App({printStatementCounter, counterInputBox, logger});
            return app.resetCounter().then(() => {
                expect(printStatementCounter.reset).to.have.been.calledWith(24);
            });
        });

        test('it does not reset the counter if counterInputBox returns non-number', () => {
            const logger = getLogger();
            const printStatementCounter = {reset: sinon.spy()};
            const counterInputBox = {read: sinon.stub().returns(Promise.resolve(null))};
            const app = new App({printStatementCounter, counterInputBox, logger});
            return app.resetCounter().then(() => {
                expect(printStatementCounter.reset).to.have.been.not.called;
            });
        });
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

    function getLogger() {
        return console;
    }
});
