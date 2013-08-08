$(function(){
  var header = $('h1#header');
  var outbox = $('#console');
  var ws = new WebSocket('ws://' + window.location.host + '/ws/');
  header.addClass('ping');

  ws.onmessage = function(evt){
    var msg = $("<div/>").addClass('msg').text(evt.data);
    outbox.append( msg );
    header.toggleClass('pong');
  }

  var wsInterval = setInterval(function(){
    ws.send('ping');
  },1000);

  window.wsPingPongStop = function(){
    clearInterval(wsInterval);
  }
  header.on('click',function(){
    wsPingPongStop();
  });
});