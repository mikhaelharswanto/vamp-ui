var request = require('superagent');

var Config = {

  TIMEOUT: 5000,

  // CORE REST API
  getApiUrl: function(){
    var host = localStorage.getItem('host') || window.location.origin;
    return host + '/api/v1';
  },
  getApiHost: function(){
    var host = localStorage.getItem('host') || window.location.origin;
    return host;
  },
  setApiHost: function(url, callback){
    // remove trailing slash
    if(url.substr(-1) === '/') {
      localStorage.setItem('host', url.substr(0, url.length - 1));
      if(typeof callback === 'function' && callback())
        callback();
    } else {
      localStorage.setItem('host', url);
      if(typeof callback === 'function' && callback())
        callback();
    }
  },
  removeApiHost: function(){
    localStorage.removeItem('host');
  }
  
};

module.exports = Config;