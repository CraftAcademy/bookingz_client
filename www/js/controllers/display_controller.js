bookingzClient.controller('DisplayController', function ($scope,
                                                         $ionicPlatform,
                                                         bookingzService,
                                                         poller,
                                                         $localStorage,
                                                         storageService) {

  $scope.hasResource = false;

  $scope.$on('noResource', function(){
    $scope.hasResource = false;
    $scope.noResourceMessage = 'Den här enheten är inte konfigurerad.';
  });

  $scope.$on('resourcePresent', function(){
    $scope.hasResource = true;
    poll.promise.then(null, null, function (response) {
      response.items.filter(function (resource) {
        if (resource.uuid == $scope.uuid) {
          $scope.resource = resource;
        }
      });

      getSlotInfo($scope.resource);
      console.log('polling');
    });
  });

  var poll = poller.get(bookingzService,
    {
      delay: 30000,
      smart: true
    }
  );

  $scope.$on('$ionicView.enter', function () {
    if ($scope.hasResource) {
      $scope.date = Date.now();
      $scope.uuid = getStoredUuid();

      bookingzService.query({uuid: $scope.uuid}, function (data) {
        getSlotInfo(data);
      });
    }
  });

  function getStoredUuid() {
    var resource = storageService.getAll().resource;
    return resource.uuid;
  }

  function getSlotInfo(data) {
    console.log(data);
    var date = new Date();
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
    });
  }
});
