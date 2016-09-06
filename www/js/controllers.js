angular.module('bookingz.controllers', [])

.controller('DisplayController', function ($scope, bookingzService){

  $scope.$on('$ionicView.enter', function() {
    $scope.allBookings();
  });

  $scope.date = Date.now();
  $scope.meeting = {
    client: 'Chalmers',
    time_start: '10:00',
    time_end: '15:00',
    lunch: '12:00 - 13:00'
  };

  $scope.allBookings = function(){
    bookingzService.query(function (data){
      console.log(data);
    })
  }

  console.log(document.body.classList.contains('platform-browser'));
  console.log(document.body.classList);

});
