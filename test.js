var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');
var Sound = require('node-aplay');
var readline = require('readline')

//! sad
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var text_to_speech = new TextToSpeechV1 ({
  username: '4692d09c-f547-4106-809f-52e938eca5bc',
  password: 'cpwU7zvcycNr'
});

var read = rl.question('Write something cool: ', (answer) => {
  var params = {
    text: answer,
    voice: 'en-US_MichaelVoice',
    accept: 'audio/wav'
  };
  text_to_speech.synthesize(params).on('finish', (error) => {
    console.log('Error:', error);
  }).pipe( fs.createWriteStream('hello_world.wav').on('finish', () => {
              var music = new Sound('hello_world.wav').play();
          }) );
  rl.close();
});





// Pipe the synthesized text to a file.
