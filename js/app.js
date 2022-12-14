(function() {
    angular.module('AlanApp', ['ui.router']);

    angular.module('AlanApp')
    .controller('KarController', KarController)
    .service("KarService", KarService)
    .config(RoutesConfig);

    KarController.$inject = ['KarService'];
    function KarController(KarService) {
        var kar = this;
        kar.character = {};
        kar.version = "1.0.1";

        kar.submit = function() {
            kar.completed = true;

            var promise = KarService.loadData();
            promise.then(function(result){
                var sysslaTemp = result.data.sysslor[KarService.getRandomInteger(result.data.sysslor.length)];
                var hobbyTemp = result.data.hobby[KarService.getRandomInteger(result.data.hobby.length)];
                var handikappTemp = hobbyTemp.handikapp[KarService.getRandomInteger(3)];
                var etnicitetTemp = result.data.etnicitet[KarService.getRandomInteger(result.data.etnicitet.length)];
                var religionTemp = result.data.religion[KarService.getRandomInteger(result.data.religion.length)];

                kar.character = {
                    syssla:sysslaTemp.namn,
                    hobby:hobbyTemp.namn,
                    handikapp:handikappTemp.namn,
                    etnicitet:etnicitetTemp.namn,
                    religion:religionTemp.namn,
                    beskrivning:sysslaTemp.beskrivning
                }
            });
        }
    }

    KarService.$inject = ['$http'];
    function KarService($http) {
        var service = this;

        service.loadData = function() {
            var response = $http({
                method: "GET",
                url: ("data/data.json")
            });

            return response;
        }

        service.getRandomInteger = function(length) {
            console.log(length);
            return Math.floor(Math.random() * length);
        }

    }

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html'
            })

            .state('character', {
                url: '/{name}',
                templateUrl: 'templates/character.html'
            })

    }

})();