angular.module('bookingz.controllers', [])

  .controller('DisplayController', function ($scope, bookingzService, poller, $localStorage) {
    console.log('First log' + getStoredUuid())
    var poller = poller.get(bookingzService, {uuid: getStoredUuid()},
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
      });
    });

    $scope.date = Date.now();

    $scope.allBookings = function () {
      bookingzService.query({uuid: getStoredUuid()}, function (data) {
        $scope.resource = data;
        getSlotInfo(data);
      })
    };

    function getStoredUuid(){
      var uuid = $localStorage.myAppData.uuid;
      $scope.uuid = uuid;
      console.log(uuid);
      return uuid;
    }

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


  })

  .controller('IndexController', function ($scope, bookingzService, poller) {
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
        console.log(response.items);
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
  .controller('setupController', function ($scope, $rootScope, storageService, $localStorage, $state, bookingzService) {
    $scope.data = {};
    console.log($scope.data);
    $scope.setSettings = function () {
      $localStorage.myAppRun = true;
      // get the devise UUID

      // hit the api post route
      bookingzService.post({resource:{
        uuid: '123e4567-e89b-12d3-a452-426655440025',
        designation: $scope.data.designation,
        capacity: 20
      }});

      $localStorage.myAppData = {uuid: '123e4567-e89b-12d3-a452-426655440025'};
      $state.go('display', null, {reload: true});
    };

    $scope.removeSettings = function () {
      $localStorage.myAppRun = false;
      $state.go('welcome', null, {reload: true});
    };
  });
