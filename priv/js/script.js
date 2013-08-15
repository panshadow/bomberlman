$(function(){
  var header = $('#header'),
    outbox = $('#console'),
    ws = new WebSocket('ws://' + window.location.host + '/ws/');

  header.addClass('ping');

  var arena = $('#arena'),
    awidth = arena.width(),
    aheight = arena.height();


  ws.onmessage = function(evt){
    var msg = JSON.parse(evt.data);
    if( 'type' in msg){
      if( msg.type === 'NOTIFY' ){
        var erl = new ErlMan({
          top: Math.round(Math.random()*aheight),
          left: Math.round(Math.random()*awidth)
        });
        erl.show();
        erl.info(msg.data.host.join('.') + ':' + msg.data.port);
      }
    }
    
  };

  var wsInterval = setInterval(function(){
    var msg = { 
      type: 'PING', 
      data: {}
    };
    ws.send(JSON.stringify(msg));
  },1000);

  window.wsPingPongStop = function(){
    clearInterval(wsInterval);
  }
});