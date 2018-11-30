'use strict';

angular.module('core.capstonApi', [
    'ngResource'
])
.factory('restService', [
    '$resource',
    function($resource){
        var capston = $resource('/api/capston',{}, {
            getParsingImage:{
                method: 'GET',
                url: '/api/v0.1.1/capston/getParsing'
            },
            getSearchRetrain:{
                method: 'GET',
                url: '/api/v0.1.1/capston/getSearchRetrain'
            },
            getCanvasRetrain:{
                method: 'GET',
                url: '/api/v0.1.1/capston/getCanvasRetrain'
            },
            getNorm:{
                method: 'GET',
                isArray: true,
                url: '/api/v0.1.1/capston/getNorm'
            },
            getScoreImage:{
                method: 'GET',
                isArray: true,
                url: '/api/v0.1.1/capston/getScore'
            },
            deleteImage:{
                method: 'PUT',
                url : '/api/v0.1.1/capston/deleteImg'
            },
            deleteCanvas:{
                method: 'PUT',
                url : '/api/v0.1.1/capston/deleteCanvas'
            },
            deleteBottleneck:{
                method: 'PUT',
                url : '/api/v0.1.1/capston/deleteBottleneck'
            },
            deleteCanvasBottleneck:{
                method: 'PUT',
                url : '/api/v0.1.1/capston/deleteCanvasBottleneck'
            },
            insertImg:{
                method: 'PUT',
                url : '/api/v0.1.1/capston/insertCanvas'
            }
        });

        return{
            capston : capston
        };
    }
]);