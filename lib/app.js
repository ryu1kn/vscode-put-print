
'use strict';

class App {
    constructor(params) {
        this._printStatementBuilder = params.printStatementBuilder;
        this._templateConfigProvider = params.templateConfigProvider;
        this._logger = params.logger;
    }

    execute(editor) {
        try {
            const selection = editor.selection;
            if (selection.isEmpty) return;

            const templateConfig = this._templateConfigProvider.get(editor.document.languageId);
            const selectedText = editor.document.getText(selection);

            return editor.edit(editBuilder => {
                const printStatement = this._printStatementBuilder.build(templateConfig, selectedText);
                editBuilder.replace(selection, printStatement);
            });
        } catch (e) {
            this._logger.error(e.stack);
        }
    }
}

module.exports = App;
