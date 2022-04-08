const cheerio = require ('cheerio');
const fs = require ('fs');

const requirement = {
    version : '1.2.2'
};

function makeAllIntegers (raw_note_json) {
    for (let key in raw_note_json)
        raw_note_json[key] = parseInt(raw_note_json[key]);
    return raw_note_json;
}

module.exports = function mmpLoadMetaDatas (filename) {
    const xml_bin = fs.readFileSync (filename);
    const $ = cheerio.load(xml_bin.toString());
    
    const version = $('lmms-project').attr ('creatorversion');
    if (requirement.version != version)
        throw Error ('Required version "' + requirement.version + '" found "' + version + '" instead.');

    const patterns = [];
    $('pattern').each ((i, elem) => {
        const temp = $(elem).find ('note');
        if (temp.length > 0) {
            let arr = [];
            $(temp).each ((j, elem) => {
                const json = $(elem).attr();
                arr.push (makeAllIntegers(json));
            });
            patterns.push (arr);
        }
    });

    return patterns;
}