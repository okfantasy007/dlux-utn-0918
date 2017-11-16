define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'Restangular', 'common/config/env.module'], function(ng) {

    var tunnel = angular.module('app.tunnel', ['ui.router.state', 'app.core', 'restangular', 'config']);
    tunnel.register = tunnel;

    tunnel.config(function($stateProvider, $controllerProvider, $compileProvider, $provide, $translateProvider, NavHelperProvider) {

        tunnel.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            service: $provide.service,
            factory: $provide.factory
        };

        $translateProvider.useStaticFilesLoader({
            prefix: 'assets/data/locale-',
            suffix: '.json'
        });

        NavHelperProvider.addControllerUrl('app/tunnel/tunnel.controller');
        NavHelperProvider.addToMenu('tunnel', {
            "link": "#/tunnel/index",
            "title": "SERVICE",
            "active": "main.tunnel.*",
            "icon": "icon-briefcase icon-large",
            "page": {
                "title": "Vpws",
                "description": "Tunnel"
            }
        });

        var access = routingConfig.accessLevels;

        $stateProvider.state('main.tunnel', {
            url: 'tunnel',
            abstract: true,
            views: {
                'content': {
                    templateUrl: 'src/app/tunnel/root.tpl.html',
                    controller: 'rootTunnelCtrl'
                }
            }
        });


        $stateProvider.state('main.tunnel.index', {
            url: '/index',
            access: access.admin,
            views: {
                '': {
                    templateUrl: 'src/app/tunnel/index.tpl.html',
                    controller: 'TunnelCtrl'
                }
            }
        });

        $stateProvider.state('main.tunnel.create-tunnel', {
            url: '/create-tunnel',
            access: access.admin,
            views: {
                '': {
                    templateUrl: 'src/app/tunnel/create-tunnel.tpl.html',
                    controller: 'CreateTunnelCtrl'
                }
            }
        });

        $stateProvider.state('main.tunnel.create-eline', {
            url: '/create-eline',
            access: access.admin,
            views: {
                '': {
                    templateUrl: 'src/app/tunnel/create-eline.tpl.html',
                    controller: 'CreateElineCtrl'
                }
            }
        });

        $stateProvider.state('main.tunnel.create-eline-module', {
            url: '/create-eline-module',
            access: access.admin,
            views: {
                '': {
                    templateUrl: 'src/app/tunnel/create-eline-module.tpl.html',
                    controller: 'CreateElineCtrl'
                }
            }
        });

    });

    return tunnel;
});
