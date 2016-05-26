angular.module('app',['ng-ip-input']).controller('ctl',function($scope){
  $scope.ipValue = '192.168.0.2';
  $scope.ipValueM = '';
  $scope.isfocus = false


  i = 1;
  $scope.setValue = function(){
    $scope.ipValue = '192.11.11.'+i;
    i++;
    $scope.$broadcast('initIpStr','');
  }

  $scope.ipDisabled = true

});