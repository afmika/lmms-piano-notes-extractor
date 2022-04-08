const MusicScore = require ('./classes/MusicScore');
const {fixedModulo, roundTwo} = require ('./classes/Tools');

const [ , , filename, mod] = process.argv;


const mods = ['--coord', '--json', '--debug', '--delta', ''];

const helpInvalid = mod => {
    if (!mods.includes (mod) && mod != undefined) {
        console.error('"' + mod + '" : Bad command !');
        console.log('lmmp-tool filename [' + mods.join('|') + ']');
        return true;
    }
    return false;
};

function makePointsFrom (tracks) {
    return tracks.map(notes => notes.map (note => {
        return [note.pos, note.freq];
    }));
}

function constructRelativeHeightsFrom (coords) {
    // assuming 0 is the lowest y value
    let first = [0, 0];
    coords = [first, ... coords];
    const res = [first];
    for (let i = 1; i < coords.length; i++) {
        let [ , y1] = coords[i - 1], // prev
            [x2, y2] = coords[i]; // next
        let diff = roundTwo(y2 - y1);
        res.push([x2, diff]);
    }
    return res;
}

function main () {
    if (helpInvalid(mod))
        return;
    const musicScore = new MusicScore ();
    const tracks = musicScore.process (filename);
    const idOperationSerial = class_obj => JSON.parse (JSON.stringify(class_obj));
    if (mod == '--debug') {
        // Dump a stringfied MusicScore object
        console.log(tracks.map(notes => notes.map (idOperationSerial)));
    } else if (mod == undefined || mod == '' || mod == '--json') {
        // Dump a list of points
        console.log(JSON.stringify(tracks));
    } else if (mod == '--coord') {
        // Dump a list of points
        console.log(JSON.stringify(makePointsFrom (tracks)));
    } else {
        // Dump a list of deltas
        console.log(
            JSON.stringify(makePointsFrom (tracks).map (constructRelativeHeightsFrom))
        );
    }
}

// start
main ();