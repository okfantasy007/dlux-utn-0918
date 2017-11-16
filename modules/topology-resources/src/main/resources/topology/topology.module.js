define(['angularAMD', 'app/routingConfig', 'app/core/core.services','Restangular', 'common/config/env.module'], function(ng) {

  var topology = angular.module('app.topology', ['ui.router.state','app.core','restangular', 'config']);

  topology.config(function($stateProvider, $controllerProvider, $compileProvider, $provide, $translateProvider, NavHelperProvider) {

    topology.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      service : $provide.service,
      factory : $provide.factory
    };

    $translateProvider.useStaticFilesLoader({
      prefix: 'assets/data/locale-',
      suffix: '.json'
    });

    NavHelperProvider.addControllerUrl('app/topology/topology.controller');
    NavHelperProvider.addToMenu('topology', {
      "link": "#/topology",
      "title": "TOPOLOGY",
      "active": "main.topology",
      "icon": "icon-sitemap icon-large",
      "page": {
        "title": "TOPOLOGY",
        "description": "TOPOLOGY"
      }
    });

    var access = routingConfig.accessLevels;
    $stateProvider.state('main.topology', {
      url: 'topology',
      access: access.public,
      views : {
        'content' : {
          templateUrl: 'src/app/topology/topology.tpl.html',
          controller: 'TopologyCtrl'
        }
      }
    });

  });

    topology.filter('filterRateType', function(){
      return function(input, type){
          var out = [];

          if(input && type){
            if(type == 'superload'){
              out = input.filter(function(item){
                return (parseFloat(item.rate) >= 0.8);
              });

            }else if(type == 'overload'){
                out = input.filter(function(item){
                    return (parseFloat(item.rate) < 0.8) && (parseFloat(item.rate) >= 0.6);
                });

            }else if(type == 'underload'){
                out = input.filter(function(item){
                    return (parseFloat(item.rate) < 0.6);
                });
            }else{
                out = input;
            }
          }

          return out;
      };
  });

  return topology;
});
