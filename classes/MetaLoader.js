const cheerio = require ('cheerio');
const fs = require ('fs');

const requirement = {
    version : '1.2.2'
};

module.exports = function mmpLoadMetaDatas (filename) {
    const xml_bin = fs.readFileSync (filename);
    const $ = cheerio.load(xml_bin.toString());
    
    const version = $('lmms-project').attr ('creatorversion');
    if (requirement.version != version)
        throw Error ('Required version "' + requirement.version + '" found "' + version + '" instead.');

    let notes = [];
    $('note').each ((i, elem) => {
        // [Note] Type [Object: null prototype]
        //  it ensures the absolute emptiness of an object because it's not based
        //  Ex: const obj = Object.create(null);
        // obj[1] = 2; // ok
        // obj.toString(); // not ok
        notes[i] = $(elem).attr();
    });
    return notes.map(note => {
        for (let key in note)
            note[key] = parseInt(note[key]);
        return note;
    });
}