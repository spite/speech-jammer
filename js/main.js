function init() {

  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

  var context = new AudioContext();

  var delayValue = document.getElementById('delayValue');
  var delayRange = document.getElementById('delayRange');

  var gainValue = document.getElementById('gainValue');
  var gainRange = document.getElementById('gainRange');

  var gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.value = 1;
  if (localStorage['gainValue']) {
    var v = parseFloat(localStorage['gainValue']);
    if (v < 1) v = 1;
    if (v > 10) v = 10;
    gain.gain.value = v;
    gainRange.value = v;
    gainValue.textContent = parseFloat(v).toFixed(1);
  }

  var delay = context.createDelay();
  delay.connect(gain);
  delay.delayTime.value = .15;
  if (localStorage['delayValue']) {
    var v = parseFloat(localStorage['delayValue']);
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    delay.delayTime.value = v;
    delayRange.value = v * 1000;
    delayValue.textContent = v * 1000;
  }

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var mediaStreamSource;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true },
      function(stream) {
        mediaStreamSource = context.createMediaStreamSource(stream);
        mediaStreamSource.connect(delay);
      },
      function(err) {
        console.log("The following error occured: " + err.name);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }

  delayRange.addEventListener('input', function(e) {

    delay.delayTime.value = this.value / 1000;
    delayValue.textContent = this.value;
    localStorage['delayValue'] = this.value / 1000;

  });

  gainRange.addEventListener('input', function(e) {

    gain.gain.value = this.value;
    gainValue.textContent = parseFloat(this.value).toFixed(1);
    localStorage['gainValue'] = this.value;

  });

}

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var overlay = document.getElementById('overlay');
overlay.addEventListener('click', onClick);

var test = new AudioContext();
if (test.state === 'running') {
  onClick();
}

function onClick() {
  overlay.removeEventListener('click', onClick);
  overlay.style.display = 'none';
  init();
}