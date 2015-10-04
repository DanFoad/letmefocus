// AUDIO CONTEXT
window.AudioContext = window.AudioContext || window.webkitAudioContext ;

if (!AudioContext) alert('This site cannot be run in your Browser. Try a recent Chrome or Firefox. ');

var audioContext = new AudioContext();
var currentBuffer  = null;

// CANVAS
var canvasWidth = 1280,  canvasHeight = 128 ;
var newCanvas   = createCanvas (canvasWidth, canvasHeight);
var context     = null;

window.onload = appendCanvas;
function appendCanvas() { document.getElementsByClassName("time")[0].appendChild(newCanvas);
                          context = newCanvas.getContext('2d'); }

// MUSIC LOADER + DECODE
function loadMusic(url) {
    var req = new XMLHttpRequest();
    req.open( "GET", url, true );
    req.responseType = "arraybuffer";
    req.onreadystatechange = function (e) {
          if (req.readyState == 4) {
             if(req.status == 200)
                  audioContext.decodeAudioData(req.response,
                    function(buffer) {
                             currentBuffer = buffer;
                             displayBuffer(buffer);
                    }, onDecodeError);
             else
                  alert('error during the load.Wrong url or cross origin issue');
          }
    } ;
    req.send();
}

function onDecodeError() {  alert('error while decoding your file.');  }

// MUSIC DISPLAY
function displayBuffer(buff /* is an AudioBuffer */) {
   var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
   var lineOpacity = canvasWidth / leftChannel.length  ;
   context.save();
   context.fillStyle = '#222' ;
   context.fillRect(0,0,canvasWidth,canvasHeight );
   context.strokeStyle = '#121';
   context.globalCompositeOperation = 'lighter';
   context.translate(0,canvasHeight / 2);
   context.globalAlpha = 0.06 ; // lineOpacity ;
   for (var i=0; i<  leftChannel.length; i++) {
       // on which line do we get ?
       var x = Math.floor ( canvasWidth * i / leftChannel.length ) ;
       var y = leftChannel[i] * canvasHeight / 2 ;
       context.beginPath();
       context.moveTo( x  , 0 );
       context.lineTo( x+1, y );
       context.stroke();
   }
   context.restore();
   console.log('done');
}

function createCanvas ( w, h ) {
    var newCanvas = document.createElement('canvas');
    newCanvas.width  = w;     newCanvas.height = h;
    return newCanvas;
};

(function($, window, document) {

    $(function() {

        $(".sounds__item").on("click", function() {
            var soundfile = "sounds/" + $(this).data("sound") + ".mp3";
            var audio = new Audio(soundfile);
            loadMusic(soundfile);
            audio.addEventListener("loadedmetadata", function(_event) {
                audio.play();
                $(".time__display").width(0);
                console.log(audio.duration);
                $(".time__display").animate({
                    "width" : "1280px"
                }, audio.duration * 1000, "linear");
            });
        });

    });

})(window.jQuery, window, document);
