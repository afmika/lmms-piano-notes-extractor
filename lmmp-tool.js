const MusicScore = require ('./classes/MusicScore');
const {stringify, roundTwo} = require ('./classes/Tools');
const Note = require('./classes/Note');

const [ , , filename, mod] = process.argv;


const mods = ['--coord', '--json', '--debug', '--delta', '--sil_delta'];

/**
 * @param {string} mod 
 */
function helpInvalid (mod) {
    if (!mods.includes (mod) && mod != undefined) {
        console.error('"' + mod + '" : Bad command !');
        console.log('lmmp-tool filename [' + mods.join('|') + ']');
        return true;
    }
    return false;
};

/**
 * Notes raw coordinates
 * This process ignore the span of a each note
 * @param {Note[]} tracks 
 */
function makePointsFrom (tracks) {
    return tracks.map(notes => notes.map (note => {
        return [note.pos, note.freq, note.duration];
    }));
}

/**
 * Inserts a silence gap as y=0 accordingly to the span of each note
 * @param {Note[]} coords 
 */
function makePointsWithSilenceGap (tracks) {
    let acc_x = 10;
    let points_family = [];
    for (let track of tracks) {
        let points = [];
        for (let note of track) {
            points.push ([acc_x, note.freq]);
            acc_x += note.duration;
            points.push ([acc_x, 0]);
            acc_x += 5;
        }
        points_family.push (points);
    }
    return points_family;
}

/**
 * @param {number[][]} coords 
 */
function constructRelativeHeightsFrom (coords) {
    // assuming 0 is the lowest y value
    let first = [0, 0];
    const res = [first];
    coords = [first, ... coords];
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
    if (mod == '--debug') {
        // Dump a stringfied MusicScore object
        const idOperationSerial = class_obj => JSON.parse (JSON.stringify(class_obj));
        console.log(tracks.map(notes => notes.map (idOperationSerial)));
    } else if (mod == undefined || mod == '' || mod == '--json') {
        // Dump a list of points
        console.log(stringify(tracks));
    } else if (mod == '--coord') {
        // Dump a list of points
        console.log(stringify(makePointsWithSilenceGap (tracks)));
    } else if (mod == '--sil_delta') {
        // Dump a list of delta points with silence
        const flattened = makePointsWithSilenceGap (tracks).flat();
        console.log(
            constructRelativeHeightsFrom (flattened)
                .map (k => `(${k[0]}, ${k[1]})`)
                .join(', ')
        );
    } else {
        // Dump a list of deltas
        const flattened = makePointsWithSilenceGap (tracks).flat();
        console.log(
            constructRelativeHeightsFrom (flattened)
        );
    }
}

// start
main ();