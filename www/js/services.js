angular.module('bookingz.services', [])

  .factory('bookingzService', function ($resource, API_URL) {
    var headers = {'Accept': 'application/json'};
    return $resource(API_URL + '/api/resources/:uuid', {},
      {
        query: {
          method: 'GET',
          headers: headers
        },

        get: {
          method: 'GET',
          headers: headers
        },

        index: {
          method: 'GET',
          headers: headers

        },
        post: {
          method: 'POST',
          headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=UTF-8'}
        },

        put: {
          method: 'PUT',
          headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=UTF-8'}
        }
      })

  })
  .factory('storageService', function ($localStorage) {
    $localStorage = $localStorage.$default({
      myAppData: []
    });

    var _getAll = function () {
      return $localStorage.myAppData;
    };
    var _add = function (setting) {
      $localStorage.myAppData = {};
      $localStorage.myAppData = setting;
    };

    return {
      getAll: _getAll,
      add: _add
    };
  })

  .service('loginService', function ($q, $localStorage) {
    return {
      loginUser: function (name, password) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        if (name == 'admin' && password == 'password') {
          deferred.resolve({
            userName: name,
            message: 'Welcome ' + name + '!'
          });
        } else {
          deferred.reject({
            message: 'Wrong credentials.'
          });
        }
        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      getLoginPattern: function () {
        console.log($localStorage);
        return $localStorage.login_pattern;
      },
      setLoginPattern: function (pattern) {
        $localStorage.login_pattern = pattern;
      },
      checkLoginPattern: function (pattern) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };

        if (pattern == this.getLoginPattern()) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        return promise;
      }
    }
  });


