const MusicScore = require ('./classes/MusicScore');

const [ , , filename, mod] = process.argv;


const mods = ['--coord', '--json', ''];

const helpInvalid = mod => {
    if (!mods.includes (mod) && mod != undefined) {
        console.error('"' + mod + '" : Bad command !');
        console.log('lmmp-tool filename [--cooord|--json]');
        return true;
    }
    return false;
};

function main () {
    if (helpInvalid(mod))
        return;
    const musicScore = new MusicScore ();
    const tracks = musicScore.process (filename);
    const idOperationSerial = class_obj => JSON.parse (JSON.stringify(class_obj));
    if (!mod || mod == '' || mod == '--json') {
        // Dump a stringfied MusicScore object
        console.log(tracks.map(notes => notes.map (idOperationSerial)));
    } else {
        // Dump a list of points
        const points = tracks.map(notes => notes.map (note => {
            return `(${note.pos}, ${note.freq})`;
        }));
        console.log(points);
    }
}

// start
main ();