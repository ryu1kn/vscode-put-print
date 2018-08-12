import {any, contains, mock, mockMethods, mockType, verify, when} from '../helper';
import App from '../../lib/app';
import PrintStatementGenerator from '../../lib/print-statement-generator';
import {Logger} from '../../lib/logger';
import CounterInputBox from '../../lib/counter-input-box';
import TextBuffer from '../../lib/text-buffer';
import PrintStatementSourceBuilder, {PrintStatementSource} from '../../lib/print-statement-source-builder';
import PrintStatementCounter from '../../lib/print-statement-counter';
import * as vscode from 'vscode';
import {Range, TextEditor, TextEditorEdit} from 'vscode';

suite('App', () => {

    const printStatementGenerator = mock(PrintStatementGenerator);
    const printStatementCounter = mock(PrintStatementCounter);
    const printStatementSourceBuilder = mock(PrintStatementSourceBuilder);
    const textBuffer = mock(TextBuffer);
    const counterInputBox = mock(CounterInputBox);
    const logger = mockType<Logger>();

    suite('#selectExpression', () => {

        test('saves selected expression to a buffer', () => {
            const editor = fakeEditor('SELECTED_TEXT', 'LANGUAGE_ID');
            const textBuffer = mock(TextBuffer);
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            app.selectExpression(editor);
            verify(textBuffer.write('SELECTED_TEXT'));
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const editor = fakeEditor('SELECTED_TEXT', 'LANGUAGE_ID');
            const logger = mockMethods<Logger>(['error']);
            const textBuffer = mock(TextBuffer);
            when(textBuffer.write(any())).thenThrow(new Error('UNEXPECTED_ERROR'));
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            app.selectExpression(editor);

            verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
        });
    });

    suite('#putPrintStatement', () => {

        const templateSource = mockType<PrintStatementSource>();

        test('it replaces the selected text with a print statement composed from a selected expression', () => {
            const selection = mockType<Range>({text: 'TEXT_TO_REPLACE', isEmpty: false});
            const editBuilder = mockMethods<vscode.TextEditorEdit>(['replace']);
            const editor = fakeEditor('TEXT_TO_REPLACE', 'LANGUAGE_ID', editBuilder);
            const printStatementSourceBuilder = mock(PrintStatementSourceBuilder);
            when(printStatementSourceBuilder.build('LANGUAGE_ID', 'SAVED_TEXT')).thenReturn(templateSource);
            const printStatementGenerator = mock(PrintStatementGenerator);
            when(printStatementGenerator.generate(templateSource)).thenReturn('PRINT_STATEMENT');
            const textBuffer = mock(TextBuffer);
            when(textBuffer.read()).thenReturn('SAVED_TEXT');
            const logger = getLogger();
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            return app.putPrintStatement(editor).then(() => {
                verify(editBuilder.replace(selection, 'PRINT_STATEMENT'));
            });
        });

        test("it puts print statement even if an expression hasn't been selected", () => {
            const selection = mockType<Range>({text: 'TEXT_TO_REPLACE', isEmpty: false});
            const editBuilder = mockMethods<vscode.TextEditorEdit>(['replace']);
            const editor = fakeEditor('TEXT_TO_REPLACE', 'LANGUAGE_ID', editBuilder);
            const printStatementSourceBuilder = mock(PrintStatementSourceBuilder);
            when(printStatementSourceBuilder.build('LANGUAGE_ID', undefined)).thenReturn(templateSource);
            const printStatementGenerator = mock(PrintStatementGenerator);
            when(printStatementGenerator.generate(templateSource)).thenReturn('PRINT_STATEMENT');
            const textBuffer = mock(TextBuffer);
            when(textBuffer.read()).thenReturn(undefined);
            const logger = getLogger();
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            return app.putPrintStatement(editor).then(() => {
                verify(editBuilder.replace(selection, 'PRINT_STATEMENT'));
            });
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const textBuffer = mock(TextBuffer);
            when(textBuffer.read()).thenThrow(new Error('UNEXPECTED_ERROR'));
            const logger = mockMethods<Logger>(['error']);
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            return app.putPrintStatement(fakeEditor('SELECTED_TEXT')).then(() => {
                verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
            });
        });
    });

    suite('#resetCounter', () => {

        test('it resets the counter value with what counterInputBox returns', () => {
            const logger = getLogger();
            const printStatementCounter = mock(PrintStatementCounter);
            const counterInputBox = mock(CounterInputBox);
            when(counterInputBox.read()).thenResolve(24);
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            return app.resetCounter().then(() => {
                verify(printStatementCounter.reset(24));
            });
        });

        test('it does not reset the counter if counterInputBox returns non-number', () => {
            const logger = getLogger();
            const printStatementCounter = mock(PrintStatementCounter);
            const counterInputBox = mock(CounterInputBox);
            when(counterInputBox.read()).thenResolve(null);
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            return app.resetCounter().then(() => {
                verify(printStatementCounter.reset(any()), {times: 0});
            });
        });

        test('it prints callstack if unhandled exception occurred', () => {
            const logger = mockMethods<Logger>(['error']);
            const printStatementCounter = mock(PrintStatementCounter);
            when(printStatementCounter.reset(any())).thenThrow(new Error('UNEXPECTED_ERROR'));
            const counterInputBox = mock(CounterInputBox);
            when(counterInputBox.read()).thenResolve(24);
            const app = new App(printStatementGenerator, printStatementCounter, printStatementSourceBuilder, textBuffer, counterInputBox, logger);
            return app.resetCounter().then(() => {
                verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
            });
        });
    });

    function fakeEditor(selectedText: string, languageId?: string, editBuilder?: TextEditorEdit) {
        return mockType<TextEditor>({
            selection: {
                text: selectedText,
                isEmpty: !selectedText
            },
            document: {
                getText: () => selectedText,
                languageId: languageId
            },
            edit: function (callback: any) {
                callback(editBuilder || {replace: () => {}});
            }
        });
    }

    function getLogger() {
        return console;
    }
});
