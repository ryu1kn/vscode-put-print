
'use strict';

const RE_SELECTION_ESCAPE_PLACEHOLDER = /{{selection:escape}}/g;
const RE_SELECTION_PLACEHOLDER = /{{selection}}/g;

class PrintStatementBuilder {

    build(templateConfig, selectedText) {
        const template = templateConfig.template;
        const escapedSelectedText = this._escapeString(selectedText, templateConfig.escape || []);
        return template.split(RE_SELECTION_ESCAPE_PLACEHOLDER).map(subtext =>
            subtext.replace(RE_SELECTION_PLACEHOLDER, selectedText)
        ).join(escapedSelectedText);
    }

    _escapeString(text, escapeRules) {
        const firstRule = escapeRules[0];
        if (!firstRule) return text;

        return text.split(firstRule[0])
            .map(subtext => this._escapeString(subtext, escapeRules.slice(1)))
            .join(firstRule[1]);
    }
}

module.exports = PrintStatementBuilder;
