const mmpLoadMetaDatas = require ('./MetaLoader');
const Note = require ('./Note');

module.exports = class MusicScore {
    constructor () {
        this.tracks = [];
    }

    process (filename) {
        const patterns = mmpLoadMetaDatas (filename);
        this.tracks = patterns.map (notes => notes.map(Note.deduceFrom));
        return this.tracks;
    }

    each (fn) {
        this.tracks.forEach (fn);
    }
}