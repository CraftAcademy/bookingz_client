bookingzClient.controller('setupController', function ($scope,
                                                       $rootScope,
                                                       storageService,
                                                       $localStorage,
                                                       $state,
                                                       bookingzService,
                                                       loginService,
                                                       $ionicPopup,
                                                       $ionicModal,
                                                       $cordovaDevice) {
  $scope.data = {};
  $scope.loginData = {};
  console.log($rootScope.currentUser == 'undefined');

  $scope.$on('$ionicView.beforeEnter', function () {
    if ($rootScope.currentUser == 'undefined') {
      //$state.go('login');
      $scope.openModal()
    }
  });

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function () {
    $scope.modal.show();
  };

  $scope.closeModal = function () {
    $scope.statusText = '';
    $scope.modal.hide();
  };


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
        $state.go('display', null, {reload: true})
      }
    );

  };

  $scope.cancelSettings = function () {
    $state.go('display', null, {reload: true})
  };

  $scope.removeSettings = function () {
    $localStorage.myAppRun = false;
    console.log($localStorage.myAppData);
    $state.go('login', null, {reload: true});
  };

  $scope.login = function (name, password) {
    var name = $scope.loginData.username || name;
    var password = $scope.loginData.password || password;
    console.log("LOGIN user: " + $scope.loginData.username + " - PW: " + $scope.loginData.password);
    loginService.loginUser(name, password).success(function (data) {
      $rootScope.currentUser.userName = data.userName;
      console.log($rootScope.currentUser.userName);
      $scope.currentUser = $rootScope.currentUser;
      $state.go('welcome', null, {reload: true});
    }).error(function (data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      }).then(function (res) {
        lock.reset();
      });


    });
  };

  $scope.log_pattern = loginService.getLoginPattern();


  var lock = new PatternLock('#lockPattern', {
    radius: 30,
    margin: 20,
    matrix: [4, 4],
    onDraw: function (pattern) {
      if ($scope.log_pattern) {
        loginService.checkLoginPattern(pattern).success(function (data) {
          $scope.login('admin', 'password');
          lock.reset();
          $state.go('welcome');
        }).error(function (data) {
          lock.error();
          $scope.login('admin', 'wrong');
        });
      } else {
        //lock.setPattern("12634");
        loginService.setLoginPattern(pattern);
        lock.reset();
        $scope.log_pattern = loginService.getLoginPattern();
        $scope.$apply();
      }
    }
  });


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
