import * as assert from 'assert';
import {argCaptor, contains, mockMethods, mockType, verify, when} from '../helper';

import CounterInputBox from '../../lib/counter-input-box';
import * as vscode from 'vscode';

suite('CounterInputBox', () => {

    test('it reads a number string from inputbox and returns as a number', () => {
        const window = mockMethods<typeof vscode.window>(['showInputBox']);
        when(window.showInputBox(contains({
            placeHolder: 'Default to 0',
            prompt: 'Number to reset the counter'
        }))).thenResolve('3');
        const inputBox = new CounterInputBox(window);
        return inputBox.read().then(result => {
            assert.deepEqual(result, 3);
        });
    });

    test('it returns null if a user dismiss the input box without confirming the input', () => {
        const window = mockType<typeof vscode.window>({showInputBox: () => Promise.resolve()});
        const inputBox = new CounterInputBox(window);
        return inputBox.read().then(result => {
            assert.deepEqual(result, null);
        });
    });

    test('it returns the default value 0 if a user left the input box empty', () => {
        const window = mockType<typeof vscode.window>({showInputBox: () => Promise.resolve('')});
        const inputBox = new CounterInputBox(window);
        return inputBox.read().then(result => {
            assert.deepEqual(result, 0);
        });
    });

    test('it specifies a validation function that gives instruction message when non number string is given', () => {
        const window = mockMethods<typeof vscode.window>(['showInputBox']);
        const captor = argCaptor();

        const inputBox = new CounterInputBox(window);
        return inputBox.read().then(_result => {
            verify(window.showInputBox(captor.capture()));
            const validate = captor.values![0].validateInput;
            assert.deepEqual(validate('NON_NUMBER'), 'Please specify a number');
        });
    });

    test('it specifies a validation function that gives nothing if a number string is given', () => {
        const window = mockMethods<typeof vscode.window>(['showInputBox']);
        const captor = argCaptor();

        const inputBox = new CounterInputBox(window);
        return inputBox.read().then(_result => {
            verify(window.showInputBox(captor.capture()));
            const validate = captor.values![0].validateInput;
            assert.deepEqual(validate('3'), '');
        });
    });

});
