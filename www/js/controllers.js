angular.module('bookingz.controllers', [])

  .controller('DisplayController', function ($scope, bookingzService, poller, storageService) {
    var poller = poller.get(bookingzService,
      {
        delay: 20000,
        smart: true
      }
    );

    $scope.$on('$ionicView.enter', function () {
      $scope.allBookings();
      poller.promise.then(null, null, function (response) {
        $scope.resource = response;
        getSlotInfo(response);
        console.log(response)

      });
    });

    $scope.date = Date.now();

    $scope.allBookings = function () {
      bookingzService.query(function (data) {
        $scope.resource = data;
        getSlotInfo(data);
      })
    };

    function getSlotInfo(data) {
      var date = new Date();
      var data = data;
      //var slots = data.slots;
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

    //This is a WIP
    function checkNextSlot(slots, slot) {
      var date = new Date();
      var currentDateTime = Date.parse(date.toString());
      var index = slots.indexOf(slot);
      //console.log(index + 1)
      var bookingTimes = slots[index + 1].info.time.split(' - ');
      var endTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[1]].join(' '));
      var status = currentDateTime < endTime;
      //console.log(status);
      return status;
    }

    //$scope.things = storageService.getAll();
    //$scope.add = function (newThing) {
    //  storageService.add(newThing);
    //};
    //$scope.remove = function (thing) {
    //  storageService.remove(thing);
    //};

  });
