app.factory('speechService',
  ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
      var synth = new SpeechSynthesisUtterance();
      synth.lang = 'en-GB';

      speechSynthesis.onvoiceschanged = function() {
        synth.voice = speechSynthesis.getVoices().filter(function(voice) {
          //return voice.name === 'Google UK English Male';
          return voice.name === 'native';
        })[0];
      };

      return {
        speak: function (text) {
          synth.text = text;
          speechSynthesis.speak(synth);
        },

        cancelSpeech: function() {
          speechSynthesis.cancel();
        }
      }
    }]);