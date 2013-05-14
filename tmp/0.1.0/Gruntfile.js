define('grunt-bodule@0.1.0/test/fixtures/foo/testing.js', [], function (require, exports, module) {
    exports.add = function(a,b){
        return a+b;
    }
        
})
define('grunt-bodule@0.1.0/test/fixtures/foo/testing1.js', [], function (require, exports, module) {
    exports.add = function(a,b){
        return a+b;
    }
        
})
define('grunt-bodule@0.1.0/test/fixtures/testing.js', ['underscore@~1.4.4'], function (require, exports, module) {
    var _ = require('underscore')
    exports.add = function(a,b){
        return a+b;
    }
        
})
define('grunt-bodule@0.1.0/test/fixtures/testing1.js', [], function (require, exports, module) {
    exports.add = function(a,b){
        return a+b;
    }
        
})