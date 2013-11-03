var bomb='☢',Player = function(opt) {
  this.x = 0;
  this.y = 0;
  this.updated = true;
  this.history = [];
  this.opt = $.extend(true,{
    width: 20,
    height: 20,
    maxx: 32,
    maxy: 24
  }, opt || {});

  this._move_up = function(){
    if(this.y>0){
      this.history.unshift({x:this.x, y:this.y, t: +(new Date())});
      this.y--;
    }
  };

  this._move_right = function(){
    if(this.x<this.opt.maxx-1){
      this.history.unshift({x:this.x, y:this.y, t: +(new Date())});
      this.x++;
    }
  };

  this._move_down = function(){
    if(this.y<this.opt.maxy-1){
      this.history.unshift({x:this.x, y:this.y, t: +(new Date())});
      this.y++;
    }
  };

  this._move_left = function(){
    if(this.x>0){
      this.history.unshift({x:this.x, y:this.y, t: +(new Date())});
      this.x--;
    }
  };

  this.move = function(o) {
    var name = '_move_'+o;
    if( name in this ){
      this[name]();
      if (this.history.length > 10){
        this.history.pop();
      }
    }
  };

  this._draw_cell = function(g,x,y,strokeStyle,fillStyle){
    var coords = [
      x * this.opt.width + 2,
      y * this.opt.height + 2,
      this.opt.width - 3,
      this.opt.height - 3
    ];

    g.beginPath();
    
    g.fillStyle = fillStyle;
    g.fillRect.apply(g, coords);

    g.lineWidth = 1;
    g.strokeStyle = strokeStyle;
    g.strokeRect.apply(g, coords);
  };

  this.draw = function(g) {
    var make_rnd = function(from,to) {
        return Math.round(from+(to-from)*Math.random());
      };

    var fillStyle = make_rnd(10,100)+','+make_rnd(200,255)+',150';
    this._draw_cell(g, this.x, this.y, 
      'rgba(100,255,150,0.7)', 'rgba('+fillStyle+',0.'+6+')');

    var p,now = +(new Date());
    for(var i=0,n=this.history.length;i<n;i++){
      p = this.history[i];
      d = Math.round((now - p.t)/30);
      if(  d < 10 ){
        this._draw_cell(g, p.x,p.y,
          'rgba(100,255,150,0)', 'rgba(100,250,150,0.'+Math.round(5*(11-d))+')');
      }
    }
    g.font = '20px Helvetica';
    g.fillStyle = 'rgba(255,255,200,0.7)';
    g.textBaseline = 'top';
    g.fillText(bomb, this.x*this.opt.width+3, this.y*this.opt.height);

  };
};

var player;
$(function(){
  var $zero = $('#zero'),
      winW = $(document).width(),
      winH = $(document).height() - 5;
      
  var $canvas = $('<canvas/>')
    .attr('width', 640)
    .attr('height', 480)
    .attr('id', 'Board')

    .appendTo($zero);


  var ctx = $canvas[0].getContext('2d');
  ctx.width = 640;
  ctx.height = 480;
  player = new Player();
  draw_loop(ctx);

  $(window).keydown(function(evt){
    switch(evt.which){
      case 87: //w
      case 38: // UP
        player.move('up');
        break;
      
      case 68: //d
      case 39: // RIGHT
        player.move('right');
        break;

      case 65: //a
      case 37: //LEFT
        player.move('left');
        break;

      case 83: //s
      case 40: // DOWN
        player.move('down');
        break;

    }
  });
});


function draw_loop (g) {
  var callback = function(){
    draw_scena(g);
    player.draw(g);
    webkitRequestAnimationFrame(callback,g);
  };

  console.log(g.width+'x'+g.height);
  callback();

  
  
}

function draw_scena(g) {
  var step=20, t=0;
  g.fillStyle = 'black';
  g.clearRect(0, 0, g.width, g.height);
  //g.fillRect(0,0,g.width,g.height);
  g.strokeStyle = 'rgba(100,150,255,0.3)';
  g.lineWidth = '1';
  g.beginPath();

  while( t<= g.width ){
    g.moveTo(t,0);
    g.lineTo(t,g.height);
    t += step;
  }
  t = 0;
  while( t<= g.height ){
    g.moveTo(0,t);
    g.lineTo(g.width,t);
    t += step;
  }
  g.stroke();
  g.strokeStyle = 'rgba(100,150,255,1)';
  g.strokeRect(0,0,g.width,g.height);
}

