angular.module( 'sample', [
  'sample.dashboard',
  'sample.login',
  'sample.signup',
  'angular-jwt',
  'angular-storage',
  'ui.bootstrap',
  'ngIdle'
])
.config( function myAppConfig ($urlRouterProvider, jwtInterceptorProvider, $httpProvider,KeepaliveProvider, IdleProvider) {
  $urlRouterProvider.otherwise('/login');

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('jwt');
  }

  $httpProvider.interceptors.push('jwtInterceptor');

})
.run(function($rootScope, $state, store, jwtHelper,Idle) {
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (to.data && to.data.requiresLogin) {
      if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
        e.preventDefault();
        $state.go('login');
      }
    }
  });

})



.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$routeChangeSuccess', function(e, nextRoute){
    if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
      $scope.pageTitle = nextRoute.$$route.pageTitle + ' | ngEurope Sample' ;
    }
  });
})

;

