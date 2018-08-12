import * as assert from 'assert';
import PrintStatementSourceBuilder, {LanguageConfig} from '../../lib/print-statement-source-builder';
import {mockMethods, when} from '../helper';
import * as vscode from 'vscode';
import {ObjectMap} from '../../lib/types/collection';

suite('PrintStatementSourceBuilder', () => {

    const templateConfig: ObjectMap<LanguageConfig> = {
        KNOWN_LANGUAGE: {
            template: 'TEMPLATE',
            escapeRules: [['ESCAPE_RULES', '']]
        },
        KNOWN_LANGUAGE_2: {
            template: undefined
        },
        KNOWN_LANGUAGE_3: {
            template: 'KNOWN_LANGUAGE_TEMPLATE'
        },
        KNOWN_LANGUAGE_4: {
            template: 'TEMPLATE'
        },
        default: {
            template: 'DEFAULT_TEMPLATE',
            templateForNoExpression: 'DEFAULT_TEMPLATE_FOR_NO_EXPRESSION'
        }
    };

    const workspaceConfig = mockMethods<vscode.WorkspaceConfiguration>(['get']);
    Object.keys(templateConfig).forEach(languageId => {
        when(workspaceConfig.get(`printStatement.${languageId}`)).thenReturn(templateConfig[languageId]);
    });
    const workspace = mockMethods<typeof vscode.workspace>(['getConfiguration']);
    when(workspace.getConfiguration('putprint')).thenReturn(workspaceConfig);

    const printStatementSourceBuilder = new PrintStatementSourceBuilder(workspace);

    test('it returns a template config for the specified language', () => {
        assert.deepEqual(printStatementSourceBuilder.build('KNOWN_LANGUAGE', 'SELECTED_EXPRESSION'), {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'TEMPLATE',
            escapeRules: [['ESCAPE_RULES', '']]
        });
    });

    test('it returns default template if one is not defined for the specified language', () => {
        assert.deepEqual(printStatementSourceBuilder.build('KNOWN_LANGUAGE_2', 'SELECTED_EXPRESSION'), {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'DEFAULT_TEMPLATE',
            escapeRules: []
        });
    });

    test('it returns default config\'s "templateForNoExpression" if one is not defined for the specified language', () => {
        assert.deepEqual(printStatementSourceBuilder.build('KNOWN_LANGUAGE_3', undefined), {
            selectedExpression: undefined,
            template: 'DEFAULT_TEMPLATE_FOR_NO_EXPRESSION',
            escapeRules: []
        });
    });

    test('it sets an empty list for escapeRules if it is not specified', () => {
        assert.deepEqual(printStatementSourceBuilder.build('KNOWN_LANGUAGE_4', 'SELECTED_EXPRESSION'), {
            selectedExpression: 'SELECTED_EXPRESSION',
            template: 'TEMPLATE',
            escapeRules: []
        });
    });
});
