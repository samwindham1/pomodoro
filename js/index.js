var running = false;
var session = true;

var sessionTime = 60*parseInt($('#session-time').html());
var breakTime = 60*parseInt($('#break-time').html());
var time = sessionTime;
var timer;

var $clock = $('.clock');

function startTimer() {
  if(session) { // session
    time = sessionTime + 1;
    $('.status').html('SESSION');
    $('.time').removeClass('break');
    $('.status').removeClass('break');
    $('.title').removeClass('break');
  } else { // break
    time = breakTime + 1;
    $('.status').html('BREAK');
    $('.time').addClass('break');
    $('.status').addClass('break');
    $('.title').addClass('break');
  }

  timer = setInterval(tick, 100);
  running = true;
}
function stopTimer() {
  clearInterval(timer);
  running = false;
}
function alarm() {
  stopTimer();

  var $body = $('body');
  var flashInterval = setInterval(function () {
    $body.toggleClass('flash');
  }, 100);

  time = 0;
  updateTime();

  setTimeout(function() {
    clearInterval(flashInterval);
    session = !session;
    startTimer();
  }, 1001); 
}

function tick() {

  if(running) {
    if(time <= 0.0){
      alarm();
    }
    else {
      // decrease time left and round down for floating point math
      time -= 0.1;
      time = parseFloat(time.toFixed(3));
    }

    // only update if full second
    if(time % parseInt(time) == 0) {
      updateTime();
    }

    // remove all update classes
    $clock.removeClass (function (index, className) {
      return (className.match (/\bprogress-\S+/g) || []).join(' ');
    });
    var startTime = (session) ? sessionTime : breakTime;
    var current = 'progress-' + parseInt( ( (startTime - time) / startTime ) * 100 );
    $clock.addClass(current);
  }
}
function updateTime() {
  // console.log(time);
  var total = parseInt(time);
  var min = parseInt(total / 60).toString();
  var sec = (total % 60).toString();

  if(min.toString().length < 2) min = '0' + min;
  if(sec.toString().length < 2) sec = '0' + sec;

  $('.time').html( min + ':' + sec );
}


$(document).ready(function() {
  updateTime();

  $('.overlay').click(function() {
    if(running){
      stopTimer();
      time = sessionTime;
      updateTime();
      session = true;
      $('.status').html('SESSION');
      $clock.removeClass (function (index, className) {
        return (className.match (/\bprogress-\S+/g) || []).join(' ');
      });
      $clock.addClass('progress-0');
      $('.time').removeClass('break');
      $('.status').removeClass('break');
      $('.title').removeClass('break');
    } else {
      session = true;
      startTimer();
    }
  });

  $('#red-break-time').click(function() {
    breakTime = Math.max(breakTime - 60, 60);
    $('#break-time').html(parseInt(breakTime/60));
    if(running) {
      stopTimer();
    }
    time = sessionTime;
    updateTime();
  });
  $('#inc-break-time').click(function() {
    breakTime = Math.min(breakTime + 60, 25*60);
    $('#break-time').html(parseInt(breakTime/60));
    if(running) {
      stopTimer();
    }
    time = sessionTime;
    updateTime();
  });
  $('#red-sess-time').click(function() {
    sessionTime = Math.max(sessionTime - 60, 60);
    $('#session-time').html(parseInt(sessionTime/60));
    if(running) {
      stopTimer();
    }
    time = sessionTime;
    updateTime();
  });
  $('#inc-sess-time').click(function() {
    sessionTime = Math.min(sessionTime + 60, 25*60);
    $('#session-time').html(parseInt(sessionTime/60));
    if(running) {
      stopTimer();
    }
    time = sessionTime;
    updateTime();
  });

});