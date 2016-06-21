# Put Print

## Features

Quickly insert print statements into your source code.

![Put print statement](https://raw.githubusercontent.com/ryu1kn/vscode-put-print/master/images/animations/put-print-statement.gif)

Escape certain sequences when converting the selected expression into a print statement.

![Put print with escape](https://raw.githubusercontent.com/ryu1kn/vscode-put-print/master/images/animations/print-statement-with-escape.gif)

Specify print statement template per language.

![Put print by language](https://raw.githubusercontent.com/ryu1kn/vscode-put-print/master/images/animations/print-statement-by-language.gif)

Put sequence number to your print statements.

![Put print with counter](https://raw.githubusercontent.com/ryu1kn/vscode-put-print/master/images/animations/print-statement-with-counter.gif)


## Commands

* `PutPrint: Select Expression for Composing Print Statement`: Select an expression to convert to a print statement (default: `ctrl+r s`).
* `PutPrint: Put Print Statement`: Put Print Statement composed from selected expression, template and counter (default: `ctrl+r s`).
* `PutPrint: Reset Counter`: Reset the counter value (default: none).

## Customise Keyboard Shortcuts

To overwrite the default keyboard shortcuts, put the key sequences you like in your keyboard shortcut settings. For example:

```json
  { "key": "shift+f6", "command": "putprint.selectExpression",
                          "when": "editorTextFocus" },
  { "key": "f6",       "command": "putprint.putPrintStatement",
                          "when": "editorTextFocus" }
```

## Extension Settings

You can specify a template for a print statement per language.

* `putprint.printStatement.${languageId}.template`: Print statement template for the language `languageId`
* `putprint.printStatement.${languageId}.escapeRules`: List of escape rules for language `languageId` template

For example, if you want to specify a print statement for javascript, you could have following entries in your "User/Workspace Settings".

```json
  "putprint.printStatement.javascript.template": "console.log('{{selectedExpression|escape}}:', {{selectedExpression}})",
  "putprint.printStatement.javascript.escapeRules": [["'", "\\'"], ["\\", "\\\\"]],
```

`{{KEYWORD}}` is for a placeholder to inject a certain value. Currently, there are:

* `{{selectedExpression}}`: Replaced with the expression you selected with "PutPrint: Select Expression ..." command
* `{{selectedExpression|escape}}`: Same with `{{selectedExpression}}` but the result will be escaped by the rules supplied as "escapeRules"
* `{{count}}`: Replaced with counter value which is incremented every time you put print statement

If you don't have a print statement setting for the editor you're working on, default template will be used.

* `putprint.printStatement.default.template`: Will be used when there is no language specific template found

## Release Notes

### 0.0.1

Initial release of put-print
