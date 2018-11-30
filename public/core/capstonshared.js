'use strict';

angular.module('core.capstonshared', [
    'core'
])
.factory('capstonshared', [
    '$rootScope',
    '$window',
    '$log',
    function($rootScope, $window, $log){
        var hello = function(){
            console.log('hello shared')
        }

        var goToPage = function(desUrl){
            var url = "http://"+ $window.location.host + "/#!/";
            url = url + desUrl;
            $log.log(url);
            $window.location.href = url;
        }


        return {
            hello: hello,
            goToPage: goToPage
        };

    }
])