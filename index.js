const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const request = require('request');
const Promise = require('promise');

const SPEECH_API = 'https://api.wit.ai/speech?v=20160526';
const token = 'my_wit_token';

const witRequest = (fileName, stream, resolve, reject) => {
  request({
    uri: SPEECH_API,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'audio/mpeg3',
      'Transfer-encoding': 'chunked',
    },
    body: stream,
    encoding: null,
  }, (error, response, body) => {
    resolve(JSON.parse(body.toString()));
  });
};

const audioToMessage = (audioUrl) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(audioUrl.substring(0, audioUrl.indexOf('?')));
    const stream = ffmpeg(audioUrl)
      .noVideo()
      .inputFormat('mp4')
      .format('mp3')
      .audioBitrate(128)
      .audioChannels(1)
      .audioCodec('libmp3lame')
      .pipe();

    witRequest(fileName, stream, resolve, reject);
  });
};

module.exports = audioToMessage;
