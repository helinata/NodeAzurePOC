angular.module("app.services", [])
.factory("appService", ["$http", "$q", function ($http, $q) {
        var appService = {};
        
        appService.getUser = function (path) {
            var deferred = $q.defer();
            
            //setup response
            var user = { user: null, manager: null, directReports: null, files: null };
            
            //get the user
            $http.get("https://graph.microsoft.com/beta/" + path).then(function (r) {
                user.user = r.data;
                if (user.user !== null && user.manager !== null && user.directReports !== null &&
                    user.files !== null)
                    deferred.resolve(user);
            });
            //get the manager
            $http.get("https://graph.microsoft.com/beta/" + path + "/manager").then(function (r) {
                user.manager = r.data;
                if (user.user !== null && user.manager !== null && user.directReports !== null &&
                    user.files !== null)
                    deferred.resolve(user);
            }, function (er) {
                user.manager = {};
                if (user.user !== null && user.manager !== null && user.directReports !== null &&
                    user.files !== null)
                    deferred.resolve(user);
            });
            //get the directReports
            $http.get("https://graph.microsoft.com/beta/" + path + "/directReports").then(function (r) {
                user.directReports = r.data;
                if (user.user !== null && user.manager !== null && user.directReports !== null &&
                    user.files !== null)
                    deferred.resolve(user);
            });
            //get the files
            $http.get("https://graph.microsoft.com/beta/" + path + "/files").then(function (r) {
                user.files = r.data;
                if (user.user !== null && user.manager !== null && user.directReports !== null &&
                    user.files !== null)
                    deferred.resolve(user);
            }, function (er) {
                user.files = {};
                if (user.user !== null && user.manager !== null && user.directReports !== null &&
                    user.files !== null)
                    deferred.resolve(user);
            });
            
            return deferred.promise;
        };
        
        return appService;
    }]);

angular.module("app.controllers", [])
.controller("loginCtrl", ["$scope", "$location", "adalAuthenticationService", function ($scope, $location, adalService) {
        if (adalService.userInfo.isAuthenticated) {
            $location.path("/user");
        }
        
        $scope.login = function () {
            adalService.login();
        };
        $scope.logout = function () {
            adalService.logout();
        };

    }])
   .controller("meCtrl", ["$scope", "appService", function ($scope, appService) {
        appService.getUser("me").then(function (d) {
            $scope.data = d;
        });
    }])
    .controller("userCtrl", ["$scope", "$routeParams", "appService", function ($scope, $routeParams, appService) {
        appService.getUser("myorganization/users/" + $routeParams.id).then(function (d) {
            $scope.data = d;
        });
    }])
    .controller("MyTestCtrl", function ($scope) {
        self = $scope;
        self.val = 'TeSt';
        self.counter = 0;
        var self = self;
        self.clicked = function () {
            self.counter++;
    };
});

angular.module("app", ["app.services", "app.controllers", "ngRoute", "AdalAngular"])
    .config(["$locationProvider", "$routeProvider", "$httpProvider", "adalAuthenticationServiceProvider", function ($locationProvider, $routeProvider, $httpProvider, adalProvider) {
        $locationProvider.html5Mode({
            enabled: true,  
            requireBase: false
        });
        
        $routeProvider
            .when("/", {
            controller: "loginCtrl",
            templateUrl: "view-login.html",
            requireADLogin: false
        })
            .when("/user", {
            controller: "meCtrl",
            templateUrl: "view-user.html",
            requireADLogin: true
        })
            .when("/user/:id", {
            controller: "userCtrl",
            templateUrl: "view-user.html",
            requireADLogin: true
        })
            .when('/test', {
            templateUrl: 'test.html', 
            controller: function () {
                console.log('On /test.');
            },
            requireADLogin: true
        })
            .when('/main', {
            templateUrl: 'main.html', 
            controller: 'MyTestCtrl',
            requireADLogin: true
        })
           .otherwise({ redirectTo: "/" });
        
        adalProvider.init(
            {
                instance: 'https://login.microsoftonline.com/', 
                tenant: 'itadev.onmicrosoft.com',
                clientId: 'ae207043-d81c-4fbb-a09f-8dde26ebc1b9',
                endpoints: {
                    "https://graph.microsoft.com/": "https://graph.microsoft.com"
                },
                anonymousEndpoints: [],
                extraQueryParameter: 'nux=1&prompt=none'
            }, $httpProvider
        );
        
    }])

  