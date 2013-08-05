$(function(){
  var header = $('h1#header');
  var ws = new WebSocket('ws://' + window.location.host + '/ws/');
  header.addClass('ping');

  ws.onmessage = function(evt){
    console.log(evt.data);
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