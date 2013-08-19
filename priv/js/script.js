$(function(){
  var header = $('#header'),
    outbox = $('#console'),
    ws = new WebSocket('ws://' + window.location.host + '/ws/');

  header.addClass('ping');

  var arena = $('#arena'),
    awidth = arena.width(),
    aheight = arena.height(),
    _erl;


  ws.onmessage = function(evt){
    var msg = JSON.parse(evt.data);
    var erl;
    if( 'type' in msg){
      if( msg.type === 'NOTIFY' ){
        var erl = new ErlMan({
          top: Math.round(Math.random()*aheight),
          left: Math.round(Math.random()*awidth)
        });
        erl.show();
        erl.info(msg.data.host.join('.') + ':' + msg.data.port);
      }
      else if(msg.type === 'NEW_PLAYER' ){
        erl = new ErlMan({
            top: 0,
            left: 0,
            local: msg.data.local
        });

        erl.show();
        erl.info( msg.data.host.join('.') + ':' + msg.data.port);
        if( msg.data.local ){
          _erl = erl;
          _erl.step();
        }
        
      }
      else if(msg.type === 'PONG' && _erl){
        _erl.next_step();
      }
    }
  };

  var wsInterval = setInterval(function(){
    var msg = { 
      type: 'PING', 
      data: {}
    };
    ws.send(JSON.stringify(msg));
  },5000);

  window.wsPingPongStop = function(){
    clearInterval(wsInterval);
  }

  $(document.body).bind('keydown',function(evt){
    if( _erl ){
      switch(evt.which){
        case 73: _erl.move_up(); break;
        case 74: _erl.move_left(); break;
        case 75: _erl.move_down(); break;
        case 76: _erl.move_right(); break;
      }
    }
  });
});