angular.module('bankaroo').service('loginService', ['$rootScope', '$http', 'localStorageService', '$window', "jwtHelper", "$q", function ($scope, $http, localStorageService, $window, jwtHelper, $q) {

    var payload = null;

    this.login = function (id, password) {
        $scope.loggingIn = true;
        var credentials = {id: id, password: password};
        $http.post('/Bankaroo/api/login', credentials)
            .success(function (data) {
                console.log("We logged in", data);
                saveToken(data.token);
                gotoApp();
            })
            .catch(function (err) {
                $scope.loggingIn = false;
                $('#loginForm').form('add errors', ['Incorrect CPR number or password']);
                console.error("Couln't log in", err)
            })
    };

    function getToken() {
        return localStorageService.get('token');
    }

    this.getToken = function() {
        return getToken();
    };

    function getPayload() {
        if (!payload) {
            payload = jwtHelper.decodeToken(getToken())
        }
        return payload;
    }

    this.userHasPermission = function (permission) {
        return getPayload().permissions.find(function (perm) {
            return perm == permission;
        });
    };

    function saveToken(token) {
        return localStorageService.set("token", token);
    }

    function gotoApp() {
        $window.location.href = './bank.html';
    }


}]);
