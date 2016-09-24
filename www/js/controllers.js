angular.module('bookingz.controllers', [])

  .controller('DisplayController', function ($scope,
                                             $ionicPlatform,
                                             bookingzService,
                                             poller,
                                             $localStorage,
                                             storageService) {

    $ionicPlatform.ready(function () {
      $scope.date = Date.now();
      $scope.uuid = getStoredUuid();
      bookingzService.query({uuid: $scope.uuid}, function (data) {
        $scope.resource = data;
        console.log('1 getting data');
        getSlotInfo(data);
      });
    });

    var poller = poller.get(bookingzService,
      {
        delay: 20000,
        smart: true
      }
    );

    $scope.$on('$ionicView.enter', function () {
      poller.promise.then(null, null, function (response) {
        console.log('2 polling data');
        response.items.filter(function (resource) {
          if (resource.designation == $scope.resource.designation) {
            $scope.resource = resource;
          }
        });
        getSlotInfo($scope.resource);
      });
    });

    $scope.allBookings = function () {
      bookingzService.query({uuid: getStoredUuid()}, function (data) {
        $scope.resource = data;
        getSlotInfo(data);
      })
    };

    function getStoredUuid() {
      //var uuid = $localStorage.myAppData.uuid;
      console.log('0 getting stored uuid');
      var uuid = storageService.getAll(uuid).uuid;
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
  .controller('setupController', function ($scope,
                                           $rootScope,
                                           storageService,
                                           $localStorage,
                                           $state,
                                           bookingzService,
                                           loginService,
                                           $ionicPopup,
                                           $cordovaDevice) {
    $scope.data = {};
    $scope.loginData = {};

    console.log($rootScope.currentUser.userName);

    if ($rootScope.currentUser.userName == '') {
      $state.go('login');
    }


    $scope.setSettings = function () {
      // get the devise UUID but on ionic serve we need to
      // fake one by generating it.
      var uuid;
      try {
        uuid = $cordovaDevice.getUUID();
      }
      catch (err) {
        uuid = generateUUID();
      }

      bookingzService.post({
          resource: {
            uuid: uuid,
            designation: $scope.data.designation,
            description: $scope.data.description,
            capacity: parseInt($scope.data.capacity)
          }
        }, function () {
          $localStorage.myAppRun = true;
          storageService.add({uuid: uuid});
          $state.go('display')
        }
      );

    };

    $scope.removeSettings = function () {
      $localStorage.myAppRun = false;
      $state.go('welcome', null, {reload: true});
    };

    $scope.login = function () {
      console.log("LOGIN user: " + $scope.loginData.username + " - PW: " + $scope.loginData.password);
      loginService.loginUser($scope.loginData.username, $scope.loginData.password).success(function (data) {
        $rootScope.currentUser.userName = data.userName;
        console.log($rootScope.currentUser.userName);
        $scope.currentUser = $rootScope.currentUser;
        $state.go('welcome', null, {reload: true});
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    };

    function generateUUID() {
      var d, r, uuid;
      d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
      }
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    };


  });
