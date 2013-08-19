(function(window, undefined){
  var ErlMan = window.ErlMan = function(opt){
    var self = this;

    var _reg = {
      shown: false,
      local: opt.local,
      top: opt.top,
      left: opt.left
    };

    self.$ = {
      el: null
    };

    self.reg = function(key, value){
      if( key in _reg ){
        if( typeof value !== 'undefined' ){
          _reg[key] = value;
        }
        return _reg[key];
      }

      return undefined;
    }
  }

  ErlMan.prototype.show = function(){
    var self = this;

    if(!self.reg('shown')){
      self.$.el = $('<div class="erlman"><div class="bottom"></div><div class="info"></div></div>');
      self.$.info = self.$.el.find('.info');

      $('#arena').append( self.$.el );
      self.$.el.css({'top':self.reg('top')+'px', 'left': self.reg('left')+'px'});
      self.$.el.toggleClass('remote',!self.reg('local'));
      self.reg('shown',true);
    }
    else{
      self.$.el.css({'top':self.reg('top')+'px', 'left': self.reg('left')+'px'});
    }
  }

  ErlMan.prototype.step = function(){
    this.$.el.addClass('step');
  }

  ErlMan.prototype.next_step = function(){
    this.$.el.toggleClass('step-next');
  }

  ErlMan.prototype.info = function(text){
    if( typeof text !== 'undefined' ){
      this.$.info.text( text );
      this.reg('info', text);
    }
  }

  ErlMan.prototype.move_by = function(dx,dy) {
    var self = this;

    self.reg('top', self.reg('top') + dy);
    self.reg('left', self.reg('left') + dx);

    self.show();
    self.next_step();
  }

  ErlMan.prototype.move_up = function(){ this.move_by(0,-5); }
  ErlMan.prototype.move_left = function(){ this.move_by(-5,0); }
  ErlMan.prototype.move_right = function(){ this.move_by(5,0); }
  ErlMan.prototype.move_down = function(){ this.move_by(0,5); }

}(this));