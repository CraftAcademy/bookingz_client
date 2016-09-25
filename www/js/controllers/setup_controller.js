bookingzClient.controller('setupController', function ($scope,
                                                       $rootScope,
                                                       storageService,
                                                       $localStorage,
                                                       $state,
                                                       bookingzService,
                                                       loginService,
                                                       $ionicPopup,
                                                       $ionicModal,
                                                       $ionicLoading,
                                                       $cordovaDevice,
                                                       $window) {
  $scope.data = {};
  $scope.loginData = {};

  $scope.$on('$ionicView.beforeEnter', function () {
    if ($rootScope.currentUser == 'undefined') {
      $scope.openLoginModal()
    }
  });

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.loginModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/welcome.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.setupModal = modal;
  });

  $scope.$on('modal.shown', function () {
    console.log('Modal is shown!');
    $scope.log_pattern = loginService.getLoginPattern();


    $scope.lock = new PatternLock('#lockPattern', {
      radius: 30,
      margin: 20,
      matrix: [4, 4],
      onDraw: function (pattern) {
        if ($scope.log_pattern) {
          loginService.checkLoginPattern(pattern).success(function (data) {
            $scope.login('admin', 'password');
            $scope.lock.reset();
            $scope.closeLoginModal();
            //$state.go('welcome');
            $scope.openSetupModal();

          }).error(function (data) {
            $scope.lock.error();
            $scope.login('admin', 'wrong');
          });
        } else {
          loginService.setLoginPattern(pattern);
          $scope.lock.reset();
          $scope.log_pattern = loginService.getLoginPattern();
          $scope.$apply();
        }
      }
    });
  });

  $scope.setSettings = function () {
    // get the devise UUID but on ionic serve we need to
    // fake one by generating it.
    $scope.showLoading('Sending Data');
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
        $scope.hideLoading();
        $scope.closeSetupModal();
        $localStorage.myAppRun = true;
        storageService.add({uuid: uuid});
        $window.location.reload(true)

      }
    );

  };

  $scope.removeSettings = function () {
    $localStorage.myAppRun = false;
    console.log($localStorage.myAppData);
    $state.go('login', null, {reload: true});
  };

  $scope.login = function (name, password) {
    var name = $scope.loginData.username || name;
    var password = $scope.loginData.password || password;
    loginService.loginUser(name, password).success(function (data) {
      $rootScope.currentUser.userName = data.userName;
      console.log($rootScope.currentUser.userName);
      $scope.currentUser = $rootScope.currentUser;
      return;
    }).error(function (data) {
      $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      }).then(function (res) {
        $scope.lock.reset();
      });


    });
  };

  $scope.openLoginModal = function () {
    console.log($scope.lock);
    $scope.loginModal.show();
  };

  $scope.closeLoginModal = function () {
    $scope.statusText = '';
    $scope.loginModal.hide();
  };

  $scope.openSetupModal = function () {
    console.log($scope.lock);
    $scope.setupModal.show();
  };

  $scope.closeSetupModal = function () {
    $scope.statusText = '';
    $scope.setupModal.hide();
  };

  //Loading
  $scope.showLoading = function (message) {
    $ionicLoading.show({
      template: message,
      duration: 1500
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  // UUID generator

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


