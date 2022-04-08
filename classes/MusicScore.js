const mmpLoadMetaDatas = require ('./MetaLoader');
const Note = require ('./Note');

module.exports = class MusicScore {
    constructor () {
        this.notes = [];
    }

    process (filename) {
        const notes = mmpLoadMetaDatas (filename);
        this.notes = notes.map (Note.deduceFrom);
        return this.notes;
    }
}