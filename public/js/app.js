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
        kar.version = "1.1.0";

        kar.submit = function() {
            kar.completed = true;

            var promise = KarService.loadData();
            promise.then(function(result){
                let syIndex = KarService.getRandomInteger(result.data.sysslor.length);
                let hoIndex = KarService.getRandomInteger(result.data.hobby.length);
                let etIndex = KarService.getRandomInteger(result.data.etnicitet.length);
                let reIndex = KarService.getRandomInteger(result.data.religion.length);

                var sysslaTemp = result.data.sysslor[syIndex];
                var hobbyTemp = result.data.hobby[hoIndex];
                var handikappTemp = hobbyTemp.handikapp[KarService.getRandomInteger(3)];
                var etnicitetTemp = result.data.etnicitet[etIndex];
                var religionTemp = result.data.religion[reIndex];

                kar.character = {
                    syssla:sysslaTemp.namn,
                    hobby:hobbyTemp.namn,
                    handikapp:handikappTemp.namn,
                    etnicitet:etnicitetTemp.namn,
                    religion:religionTemp.namn,
                    beskrivning:sysslaTemp.beskrivning
                }

                let prompt = result.data.sysslor[syIndex].prompt + ", is " + result.data.etnicitet[etIndex].prompt + ", grim, realistic, 4k";
                console.log(prompt);
                generateImageRequest(prompt);
            });
        }

        async function generateImageRequest(prompt) {
            try {
                const response = await fetch('/openai/generateimage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        prompt
                    })
                });

                if(!response.ok){
                    throw new Error('That image could not be generated');
                }

                // Shit wont fucking work with angular, enjoy this disgusting blend of angular and DOMManipulation
                const data = await response.json();
                console.log(data);
                const imageUrl = data.data;
                document.querySelector('#image').src = imageUrl;

            } catch (error) {
                
            }
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