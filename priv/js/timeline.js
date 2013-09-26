(function(window, undefined){
  'use strict';

  var TimeLine = window.TimeLine = function( _opt ) {
    var self = this,
      opt = {
        live: function(){
          console.log('nothing');
        }
      },key;

    self.set = function(key, value) {
      opt[key] = value;
      return opt[key];
    };

    self.has = function(key, type) {
      if( key in opt ) {
          return ( (typeof type !== 'undefined') ?
            (typeof opt[key] === type) : true );
      }
      return false;
    };

    self.get = function(key, def) {
      return ( self.has(key) ? opt[key] : def);
    };

    for( key in _opt ){
      self.set(key, _opt[key]);
    }
  };

  TimeLine.prototype.loop = function( t_now ) {
    var self = this,
      t_start, t_d,
      out = [],
      i, n, subs;

    if ( typeof t_now === 'undefined' ) {
      t_now = +(new Date());
    }
    
    if( !self.has('init') ){
      t_start = self.set('init', t_now );
    }else{
      t_start = self.get('init');
    }
    t_d = t_now - t_start;

    if( self.intime(t_d) ){
        if( self.has('live','function') ){
          out.push({
            fn: self.get('live'),
            lv: self.get('level',0),
            time: t_d
          });
        }


        for( subs = self.get('subs',[]), i = 0, n = subs.length; i<n; i++){
            if(subs[i].intime(t_d)){
              out.push.apply(out, subs[i].loop(t_d) );    
            }
        }
    }


    return out;
  };

  TimeLine.prototype.join = function(sub){
    var subs = this.get('subs',[]);
    
    subs.push(sub);
    this.set('subs',subs);

    return this;
  };

  TimeLine.prototype.intime = function(t){
    var t_start = this.get('start',0);

    if( this.has('during') ){
      return ( t>= t_start && t<= t_start + this.get('during') );
    }
    else{
      return ( t>= t_start );
    }
  }

}(this));