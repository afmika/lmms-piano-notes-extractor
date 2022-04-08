const MusicScore = require ('../classes/MusicScore');

const musicScore = new MusicScore ();
// const file = './sandbox/cdefgab-sample.mmp';
const file = './sandbox/cdefgab-with-extra.mmp';

console.log(musicScore.process(file));