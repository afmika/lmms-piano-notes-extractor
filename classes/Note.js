module.exports = class Note {
    constructor (note, octave) {
        this.note = note || null;
        this.octave = octave || null;
        this.pos = 0;
        this.duration = 0;
    }

    toString () {
        return `[n = ${this.note}, o = ${this.octave}, x = ${this.pos}, d = ${this.duration}]`;
    }

    /**
     * @param {object[]} parsed_xml_list [{pos, pan, len, vol, key}, ....]
     */
    static deduceFrom (parsed_xml_list) {
        // pos 48 on the piano roll ==> C4
        // based on this information we can deduce the octave and the note
        // negative modulos in Javascript works the same as the Java Impl
        const mod = (a, n) => {
            return ((a % n) + n) % n;
        }

        let roll_note_off = 48;
        let roll_octa_off = 4;
        const seq = [
            'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
        ];

        const {key, pos, len} = parsed_xml_list;
        let dist = key - roll_note_off;         
        let d_oct = Math.floor (Math.abs (dist / (seq.length + 1)));
        
        let note = new Note(
            seq[mod(dist, seq.length)],
            roll_octa_off + d_oct * (dist >= 0 ? 1 : -1) // ?
        );

        note.pos = pos;
        note.duration = len;
        note.__orig = key;

        return note;
    }
}