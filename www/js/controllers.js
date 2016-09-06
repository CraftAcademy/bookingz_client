angular.module('bookingz.controllers', [])

.controller('DisplayController', function ($scope){

  $scope.date = Date.now();
  $scope.meeting = {
    client: 'Chalmers',
    time_start: '10:00',
    time_end: '15:00',
    lunch: '12:00 - 13:00'
  };

});
