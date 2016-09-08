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

  });
