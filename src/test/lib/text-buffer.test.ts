import * as assert from 'assert';
import TextBuffer from '../../lib/text-buffer';

suite('TextBuffer', () => {

    test('it can store one text', () => {
        const textBuffer = new TextBuffer();
        textBuffer.write('TEXT');
        assert.deepEqual(textBuffer.read(), 'TEXT');
    });
});
