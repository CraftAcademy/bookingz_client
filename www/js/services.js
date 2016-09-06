angular.module('bookingz.services', [])

.factory('bookingzService', function($resource){
  return $resource('https://bookingz.herokuapp.com/api/resources', {},{
    query: {
      method: 'GET',
      headers: {HTTP_ACCEPT: 'application/json'}
    }
  })

});
