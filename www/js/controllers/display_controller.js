bookingzClient.controller('DisplayController', function ($scope,
                                                         $ionicPlatform,
                                                         bookingzService,
                                                         poller,
                                                         $localStorage,
                                                         storageService) {

  $ionicPlatform.ready(function () {


  });

  var poller = poller.get(bookingzService,
    {
      delay: 20000,
      smart: true
    }
  );

  $scope.$on('$ionicView.enter', function () {
    $scope.date = Date.now();
    $scope.uuid = getStoredUuid();
    //$scope.resource = {};
    bookingzService.query({uuid: $scope.uuid}, function (data) {
      //$scope.resource = data;
      getSlotInfo(data);
    });

  });

  poller.promise.then(null, null, function (response) {
    response.items.filter(function (resource) {
      if (resource.uuid == $scope.uuid) {
        $scope.resource = resource;
      }
    });
    getSlotInfo($scope.resource);
    console.log('polling')
  });

  $scope.allBookings = function () {
    bookingzService.query({uuid: getStoredUuid()}, function (data) {
      $scope.resource = data;
      getSlotInfo(data);
    })
  };

  function getStoredUuid() {
    var resource = storageService.getAll().resource;
    return resource.uuid;
  }

  function getSlotInfo(data) {
    var date = new Date();
    var data = data;
    var currentDateTime = Date.parse(date.toString());
    angular.forEach(data.slots, function (slot) {
      var bookingTimes = slot.info.time.split(' - ');
      var startTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[0]].join(' '));
      var endTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[1]].join(' '));
      if ((currentDateTime > startTime) && (currentDateTime < endTime)) {
        $scope.state = slot.state;
        if (slot.state == 'booked') {
          $scope.meeting = slot.info;
        }
      }
    })
  }


});
