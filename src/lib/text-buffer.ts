
export default class TextBuffer {
    private text: string;

    write(text) {
        this.text = text;
    }

    read() {
        return this.text;
    }

}
