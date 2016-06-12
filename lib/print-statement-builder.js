
'use strict';

const RE_SELECTION_ESCAPE_PLACEHOLDER = /{{selection:escape}}/g;
const RE_SELECTION_PLACEHOLDER = /{{selection}}/g;

class PrintStatementBuilder {

    build(template, selectedText) {
        const escapedSelectedText = selectedText.replace(/'/g, "\\'");
        return template.split(RE_SELECTION_ESCAPE_PLACEHOLDER).map(subtext =>
            subtext.replace(RE_SELECTION_PLACEHOLDER, selectedText)
        ).join(escapedSelectedText);
    }

}

module.exports = PrintStatementBuilder;
