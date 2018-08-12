
export default class TextBuffer {
    private text?: string;

    write(text: string) {
        this.text = text;
    }

    read() {
        return this.text;
    }

}
