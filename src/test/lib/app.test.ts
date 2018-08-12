import {expect} from 'chai';
import * as sinon from 'sinon';
import {stubWithArgs} from '../helper';
import App from '../../lib/app';

suite('App', () => {

    suite('#selectExpression', () => {

        test('saves selected expression to a buffer', () => {
            const editor = fakeEditor('SELECTED_TEXT', 'LANGUAGE_ID');
            const textBuffer = {write: sinon.spy()};
            new App({textBuffer}).selectExpression(editor);
            expect(textBuffer.write.args[0]).to.eql(['SELECTED_TEXT']);
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const editor = fakeEditor('SELECTED_TEXT', 'LANGUAGE_ID');
            const logger = {error: sinon.spy()};
            const textBuffer = {
                write: () => {throw new Error('UNEXPECTED_ERROR');}
            };

            new App({textBuffer, logger}).selectExpression(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    suite('#putPrintStatement', () => {

        test('it replaces the selected text with a print statement composed from a selected expression', () => {
            const selection = {text: 'TEXT_TO_REPLACE', isEmpty: false};
            const editor = fakeEditor(selection.text, 'LANGUAGE_ID');
            const printStatementSourceBuilder = {build: stubWithArgs(['LANGUAGE_ID', 'SAVED_TEXT'], 'TEMPLATE_SOURCE')};
            const printStatementGenerator = {generate: stubWithArgs(['TEMPLATE_SOURCE'], 'PRINT_STATEMENT')};
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
            const printStatementSourceBuilder = {build: stubWithArgs(['LANGUAGE_ID', undefined], 'TEMPLATE_SOURCE')};
            const printStatementGenerator = {generate: stubWithArgs(['TEMPLATE_SOURCE'], 'PRINT_STATEMENT')};
            const textBuffer = {read: () => {}};
            const logger = getLogger();
            const app = new App({printStatementGenerator, printStatementSourceBuilder, textBuffer, logger});
            return app.putPrintStatement(editor).then(() => {
                expect(editor._editBuilder.replace.args).to.eql([[selection, 'PRINT_STATEMENT']]);
            });
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const textBuffer = {read: sinon.stub().throws(new Error('UNEXPECTED_ERROR'))};
            const logger = {error: sinon.spy()};
            const app = new App({textBuffer, logger});
            return app.putPrintStatement(fakeEditor('SELECTED_TEXT')).then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
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
                expect(printStatementCounter.reset.args[0]).to.eql([24]);
            });
        });

        test('it does not reset the counter if counterInputBox returns non-number', () => {
            const logger = getLogger();
            const printStatementCounter = {reset: sinon.spy()};
            const counterInputBox = {read: sinon.stub().returns(Promise.resolve(null))};
            const app = new App({printStatementCounter, counterInputBox, logger});
            return app.resetCounter().then(() => {
                expect(printStatementCounter.reset.callCount).to.eql(0);
            });
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const logger = {error: sinon.spy()};
            const printStatementCounter = {
                reset: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            const counterInputBox = {read: sinon.stub().returns(Promise.resolve(24))};
            const app = new App({printStatementCounter, counterInputBox, logger});
            return app.resetCounter().then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
            });
        });
    });

    function fakeEditor(selectedText, languageId?) {
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
