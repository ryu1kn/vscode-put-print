
'use strict';

class TextBuffer {
    write(text) {
        this._text = text;
    }

    read() {
        return this._text;
    }
}

module.exports = TextBuffer;
