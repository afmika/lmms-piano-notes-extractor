const MusicScore = require ('./classes/MusicScore');

const [ , , filename] = process.argv;


const musicScore = new MusicScore ();
const tracks = musicScore.process (filename);
const idOperationSerial = class_obj => JSON.parse (JSON.stringify(class_obj));

console.log(tracks.map(notes => notes.map (idOperationSerial)));