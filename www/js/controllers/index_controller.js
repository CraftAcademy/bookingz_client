bookingzClient.controller('IndexController', function ($scope, bookingzService, poller) {
    var poller = poller.get(bookingzService,
      {
        delay: 20000,
        smart: true
      }
    );

    $scope.$on('$ionicView.enter', function () {
      $scope.allBookings();
      poller.promise.then(null, null, function (response) {
        $scope.resourceIndex = response.items;
      });
    });

    $scope.allBookings = function () {
      bookingzService.get({}, function (response) {
        $scope.resourceIndex = response.items;
      })
    };

    $scope.currentSlotInfo = function (resource) {
      var message, date, data;
      date = new Date();
      data = resource;
      var currentDateTime = Date.parse(date.toString());
      angular.forEach(data.slots, function (slot) {
        var bookingTimes = slot.info.time.split(' - ');
        var startTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[0]].join(' '));
        var endTime = Date.parse([date.toJSON().slice(0, 10), bookingTimes[1]].join(' '));
        if ((currentDateTime > startTime) && (currentDateTime < endTime)) {
          message = 'test';
          if (slot.state == 'booked') {
            message = slot.info;
          }
        }
      });
      return message;
    }


  })
