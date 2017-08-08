var fs = require('fs');
//var TJBot = require('tjbot');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var Sound = require('node-aplay');
var mic = require('mic');
var exec = require('child_process').exec;

var speech_to_text = new SpeechToTextV1 ({
  username: 'ade5c0ec-6951-4fdc-b0e1-5f212fc52d3c',
  password: 'Vw5j5gBUJJc7'
});

var text_to_speech = new TextToSpeechV1 ({
  username: '4692d09c-f547-4106-809f-52e938eca5bc',
  password: 'cpwU7zvcycNr'
});

var params = {
  model: 'en-US_BroadbandModel',
  content_type: 'audio/flac',
  'interim_results': true,
  'max_alternatives': 3,
  'word_confidence': false,
  timestamps: false,
  keywords: ['colorado', 'tornado', 'tornadoes'],
  'keywords_threshold': 0.5
};



//var recognizeStream = speech_to_text.createRecognizeStream(params);



var credentials = {
    speech_to_text: {
        username: 'ade5c0ec-6951-4fdc-b0e1-5f212fc52d3c',
        password: 'Vw5j5gBUJJc7'
    },
    text_to_speech: {
        username: '4692d09c-f547-4106-809f-52e938eca5bc',
        password: 'cpwU7zvcycNr'
    },  
    visual_recognition: {
        api_key: '76f3ceeae94849214680d547895f2600fc2118fa'
    }
};

var hardware = ['speaker', 'microphone'];

/*var larry = new TJBot(hardware, {
  log: {
    level: 'verbose'
  },
  robot: {
    gender: 'male',
    name: 'Larry'
  },
  speak: {
    language: 'en-US'
  },
  listen: {
    microphoneDeviceId: 'hw:0,0'
  }
}, credentials);*/

/*larry.speak("hello people, I am Larry from Innovation Lab at Galileo University.").then(() => {
  larry.listen((msg) => {
    

    
    console.log("hi");
        
  });
});*/

var micInstance = mic({ 'rate': '16000', 'channels': '2', 'debug': true, 'exitOnSilence': 6, 'device': 'hw:0,0' });
var micInputStream = micInstance.getAudioStream();

var outputFileStream = fs.WriteStream('output.wav');

micInputStream.pipe(outputFileStream);



micInputStream.on('data', function(data) {
    //console.log("Recieved Input Stream: " + data.length);
}).pipe(speech_to_text.createRecognizeStream({
   content_type: 'audio/l16; rate=44100',
   inactivity_timeout: -1 
  })).setEncoding('utf8').on('data', function(event) {
     console.log('Data:', event);
     try{
       fs.unlinkSync('answer.wav');
     }catch(error){}
     fs.truncate('output.wav', 0, function(){});
     
     if(JSON.stringify(event) === JSON.stringify("hello ")){
      /*
      de-DE_BirgitVoice
      de-DE_DieterVoice
      en-GB_KateVoice
      en-US_AllisonVoice
      en-US_LisaVoice
      en-US_MichaelVoice
      es-ES_LauraVoice
      es-ES_EnriqueVoice
      es-LA_SofiaVoice
      es-US_SofiaVoice
      fr-FR_ReneeVoice
      it-IT_FrancescaVoice
      ja-JP_EmiVoice
      pt-BR_IsabelaVoice
      */
      var paramsT2S = {
        text: 'hello',
        voice: 'en-US_MichaelVoice',
        accept: 'audio/wav'
     };
     text_to_speech.synthesize(paramsT2S).on('finish', (error) => {
    console.log('Error:', error);
    }).pipe(fs.createWriteStream('answer.wav').on('finish', () => {
               
                var music = new Sound('answer.wav').play( () => {
                  try{
                    fs.unlinkSync('answer.wav');
                  }catch(error){}
                });
            }));
     }
     
    });

micInstance.start();

micInputStream.on('silence', () => {
    //console.log("silence");
})

  /*fs.createReadStream('output.wav').pipe(speech_to_text.createRecognizeStream({
   content_type: 'audio/l16; rate=44100' 
  })).pipe(fs.createWriteStream('transcription.txt'));
*/
