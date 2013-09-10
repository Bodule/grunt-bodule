define('grunt-bodule-wrapping@0.1.0/test/fixtures/foo/testing', [], function (require, exports, module) {
  
  # indent for readability
  exports.add = function(a,b){
        return a+b;
    }
    
})
define('grunt-bodule-wrapping@0.1.0/test/fixtures/foo/testing1', [], function (require, exports, module) {
  
  # indent for readability
  exports.add = function(a,b){
        return a+b;
    }
    
})
define('grunt-bodule-wrapping@0.1.0/test/fixtures/testing', ['underscore@1.4.4'], function (require, exports, module) {
  
  # indent for readability
  var _ = require('underscore')
    exports.add = function(a,b){
        return a+b;
    }
    
})
define('grunt-bodule-wrapping@0.1.0/test/fixtures/testing1', [], function (require, exports, module) {
  
  # indent for readability
  exports.add = function(a,b){
        return a+b;
    }
    
})