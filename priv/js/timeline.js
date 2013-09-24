(function(window, undefined){
  'use strict';

  var TimeLine = window.TimeLine = function( _opt ) {
    var self = this,
      opt = {
      };

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
      return ( self.has('key') ? opt[key] : def);
    };
  };

  TimeLine.prototype.loop = function( t_now ) {
    var self = this,
      t_start, t_now = t_now || +(new Date()), t_d,
      out = [],
      i, n, subs = self.get('subs',[]);
    
    if( !self.has('start') ){
      t_start = self.set('start', t_now );
    }else{
      t_start = self.get('start');
    }
    t_d = t_now - t_start;

    if( self.has('live','function') ){
      out.push({
        fn: self.get('live'),
        lv: self.get('level',0)
      });
    }

    for(i=0, n=subs.length; i<n; i++){
      out.push.apply(out, subs.loop(t_now) );
    }

    return out;
  };

}(this));