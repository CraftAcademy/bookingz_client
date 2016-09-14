angular.module('bookingz.services', [])

  .factory('bookingzService', function ($resource, API_URL) {
    // Note: The uuid need to be hardcoded for each individual resource.
    var headers = {'Accept': 'application/json'};
    return $resource(API_URL + '/api/resources/:uuid',
      {uuid: "55575ef4-6c10-44df-88d0-2097f99653b8"},
      {
        query: {
          method: 'GET',
          headers: headers
        },

        get: {
          method: 'GET',
          headers: headers
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
      $localStorage.myAppData.push(setting);
    };
    var _remove = function (setting) {
      $localStorage.myAppData.splice($localStorage.settings.indexOf(setting), 1);
    };
    return {
      getAll: _getAll,
      add: _add,
      remove: _remove
    };
  });


