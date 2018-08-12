
export default class TextBuffer {
    private _text: string;

    write(text) {
        this._text = text;
    }

    read() {
        return this._text;
    }

}
