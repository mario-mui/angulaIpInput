angular.module('app',['ng-ip-input']).controller('ctl',function($scope){
  $scope.ipValue = '192.168.0.1';
  $scope.ipValueM = '';
  $scope.isfocus = false


  $scope.setValue = function(){
    $scope.ipValue = ''
    $scope.$broadcast('initIpStr','');
  }

  $scope.ipDisabled = true

});