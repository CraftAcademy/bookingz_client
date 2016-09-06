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
      $scope.resource = data;
      console.log(data);
      getSlotInfo(data);
    })
  };


function getSlotInfo (data) {
  var date = new Date();
  var data = data;
  var currentDateTime = Date.parse(date.toString());
  angular.forEach(data.slots, function (slot){
    //slot.
    var bookingTimes = slot.info.time.split(' - ');
    var startTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[0]].join(' '))
    var endTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[1]].join(' '));
    if ((currentDateTime > startTime) && (currentDateTime < endTime)) {
      $scope.state = slot.state;
    };
  })
}



});
