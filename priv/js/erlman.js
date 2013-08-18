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

}(this));