bookingzClient.controller('DisplayController', function ($scope,
                                                         $ionicPlatform,
                                                         bookingzService,
                                                         poller,
                                                         $localStorage,
                                                         storageService,
                                                         SHOW_DATE,
                                                         SHOW_RESOURCE_NAME,
                                                         ActionCableChannel) {

  $scope.hasResource = false;
  $scope.showDate = SHOW_DATE;
  $scope.showResourceName = SHOW_RESOURCE_NAME;

  $scope.$on('noResource', function(){
    $scope.hasResource = false;
    $scope.noResourceMessage = 'Den här enheten är inte konfigurerad.';
  });

  $scope.$on('resourcePresent', function(){
    $scope.hasResource = true;
    //console.log($localStorage.myAppData.resource.f_code);
    $scope.facilityId = $localStorage.myAppData.resource.f_code;
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
      subscribeToChannel($scope, ActionCableChannel);

      bookingzService.query({uuid: $scope.uuid}, function (data) {
        getSlotInfo(data);
      });
    }
  });

  function subscribeToChannel($scope, ActionCableChannel) {
    $scope.noteText = "";

    // connect to ActionCable
    var consumer = new ActionCableChannel("NoteChannel", {facility_code: $scope.facilityId});
    var callback = function(data){
      $scope.noteText = data.note;
    };
    consumer.subscribe(callback).then(function(){
      });
  }

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
