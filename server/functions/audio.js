const Fs = require('fs');
const { PassThrough } = require('stream');
const Throttle = require('throttle');
const mm = require('music-metadata');

const {
  getTrack,
  getNextTrackFromRadioQueue,
  clearCycle,
} = require('./db/track.db');

const sinks = [];

const streamHandler = (req, h) => {
  const sink = new PassThrough();
  sinks.push(sink);
  console.log(sinks.length);
  return h.response(sink).type('audio/mpeg');
};

const streamTrack = async (req, h) => {
  const track = await getTrack(req, h);
  const path = track.path;
  const stat = Fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = Fs.createReadStream(path, { start, end });
    const response = h.response(file);
    response.header('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    response.header('Accept-Ranges', `bytes`);
    response.header('Content-Length', `${chunksize}`);
    response.header('Content-Type', `audio/mpeg`);
    return response;
  }
};

const startStreaming = async (db) => {
  console.log('Started streaming radio');
  await clearCycle(db);
  const playLoop = async () => {
    const nextTrack = await getNextTrackFromRadioQueue(db);
    const song = Fs.createReadStream(nextTrack);
    console.log('Current song: ', song.path);
    const metadata = await mm.parseFile(song.path);
    const throttle = new Throttle(metadata.format.bitrate / 8);
    throttle.on('data', (chunk) => sinks.forEach((sink) => sink.write(chunk)));
    song.pipe(throttle, { end: false });
    song.on('end', () => playLoop());
  };
  playLoop();
};

module.exports = {
  streamHandler,
  startStreaming,
  streamTrack,
};
