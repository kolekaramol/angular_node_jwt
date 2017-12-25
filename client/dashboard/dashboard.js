angular.module('sample.dashboard', [
  'ui.router',
  'angular-storage',
  'angular-jwt',
  'ui.bootstrap',
  'ngIdle'
])
  .config(function ($stateProvider, KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(5);
    IdleProvider.timeout(5);
    KeepaliveProvider.interval(10);
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      controller: 'DashboardCtrl',
      templateUrl: 'dashboard/dashboard.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('DashboardCtrl', function DashboardController($scope, $http, store, jwtHelper, $state, Idle, Keepalive, $interval) {

    //Idle.watch();



    $scope.jwt = store.get('jwt');
    $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

    console.log($scope.decodedJwt);
    var intervalPromise;

    $scope.startInterval = function () {
      intervalPromise = $interval(function () {
        console.log("Interval Function is Running");
      }, 2000);
    };

    $scope.startInterval();

    $scope.logout = function () {
      store.remove('jwt');
      store.remove('ngIdle.expiry');
      $interval.cancel(intervalPromise);
      console.log("Intarval Cancel");
      $state.go('login');

    }

    $scope.callAnonymousApi = function () {
      // Just call the API as you'd do using $http
      callApi('Anonymous', 'http://localhost:3001/api/random-quote');
    }



    $scope.callSecuredApi = function () {
      callApi('Secured', 'http://localhost:3001/api/protected/random-quote');
    }

    function callApi(type, url) {
      $scope.response = null;
      $scope.api = type;
      $http({
        url: url,
        method: 'GET'
      }).then(function (quote) {
        $scope.response = quote.data;
      }, function (error) {
        $scope.response = error.data;
      });
    };































    $scope.started = false;

    function closeModals() {
      if ($scope.warning) {

        // $scope.warning.close();
        $scope.warning = null;

      }

      if ($scope.timedout) {
        $scope.timedout.close();
        $scope.timedout = null;
      }
    }
    //  $scope.countdown = 5;
    $scope.$on('IdleStart', function () {
      closeModals();
      console.log("idle start");
      $scope.warning = function () {
        $scope.countdown = 5;
        console.log("countdown started " + $scope.countdown);
      };
      $scope.warning();
    });

    $scope.$on('IdleEnd', function () {
      closeModals();
      console.log("IDLE end Called");

    });

    $scope.$on('IdleTimeout', function () {

      console.log("IDLE timeout Called");
      closeModals();

      $scope.timedout = function () {
        alert("Session expired");
        // $state.go("login");

        $scope.logout();
      }
      $scope.timedout();
    });


    $scope.start = function () {
      closeModals();
      Idle.watch();
      $scope.started = true;
      console.log("start calleedd");
    };


    $scope.start();


  });
