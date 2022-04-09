const {fixedModulo, roundTwo} = require ('./Tools');

// constants
const sequence = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const note_per_oct = sequence.length; // 12

// base frequency of a C on octave 4 in Hz
const base_freq = 130.81278265;
// * Rule #1. Freq of X on octave N == 2 * Freq of X on octave N+1
// * Rule #2. Freq of X = R * Freq of Prev of X
//   We must find a number such that
//   R^nb_of_notes = 2 to satisfy Rule #1 and Rule #2 at the same time
const base_ratio = Math.pow (2, 1 / note_per_oct);

// pos 48 on the piano roll ==> C4
// based on this information we can deduce the octave and the note
const roll_note_off = 48;
const roll_octa_off = 4;

module.exports = class Note {
    constructor (note, octave) {
        this.note = note || null;
        this.octave = octave || null;
        this.pos = 0;
        this.freq = 0;
        this.duration = 0;
    }

    toString () {
        return `[n = ${this.note}, o = ${this.octave}, x = ${this.pos}, d = ${this.duration}]`;
    }

    /**
     * @param {object[]} parsed_json_note {pos, pan, len, vol, key}
     */
    static deduceFrom (parsed_json_note) {
        const {key, pos, len} = parsed_json_note;

        const dist = key - roll_note_off;
        const d_oct = Math.floor (dist / note_per_oct); // signed
        
        const note_str = sequence [fixedModulo (dist, note_per_oct)];
        const octave = roll_octa_off + d_oct;

        const note = new Note (note_str, octave);

        note.pos = pos;
        note.freq = roundTwo (Note.computeNaturalFreq (note_str, octave));
        note.duration = len;
        // note.__orig = key;
        // note.__dist = d_oct;

        return note;
    }

    /**
     * @param {string} note_str any of C, C#, D, D#, E, F, F#, G, G#, A, A#, B
     * @param {number} octave octave index (negative value allowed) 
     */
    static computeNaturalFreq (note_str, octave) {
        let pos = sequence.indexOf (note_str);
        if (pos < 0)
            throw Error ('"' + note_str + '" is not a part of the sequence');
        
        const N = pos + (octave - roll_octa_off) * note_per_oct;
        // According to Rule #2
        // note_N = R^N * base_freq
        return Math.pow (base_ratio, N) * base_freq;
    }

    /**
     * @param {number} pos 
     * @param {number} duration 
     */
    static silent (pos, duration) {
        const note = new Note(null, null);
        note.pos = pos;
        note.duration = duration;
        note.freq = 0;
        return note;
    }
}