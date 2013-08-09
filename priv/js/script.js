$(function(){
  var header = $('#header'),
    outbox = $('#console'),
    ws = new WebSocket('ws://' + window.location.host + '/ws/');

  header.addClass('ping');

  ws.onmessage = function(evt){
    var msg = JSON.parse(evt.data);
    if( 'type' in msg){
      if( msg.type === 'NOTIFY' ){
        var divMsg = $("<div/>").addClass('msg').text(msg.data.host.join('.') + ':' + msg.data.port);
        outbox.append( divMsg );

      }
      else if( msg.type === 'PONG' ){
        header.toggleClass('pong');  
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
  header.on('click',function(){
    wsPingPongStop();
  });
});