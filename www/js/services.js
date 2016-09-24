angular.module('bookingz.services', [])

  .factory('bookingzService', function ($resource, API_URL) {
    // Note: The uuid need to be hardcoded for each individual resource.
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
          headers: {'Accept': 'application/json', 'Content-Type':'application/json; charset=UTF-8'}
        }
      })

  })
  .factory('storageService', function ($localStorage){
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

  .service('loginService', function($q) {
    return {
      loginUser: function(name, password) {
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
        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      getLoginPattern: function() {
        return window.localStorage.getItem('login_pattern');
      },
      setLoginPattern: function(pattern) {
        window.localStorage.setItem('login_pattern', pattern);
      },
      checkLoginPattern: function(pattern) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        }

        if (pattern == this.getLoginPattern()) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        return promise;
      }
    }
  });


