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
  });


