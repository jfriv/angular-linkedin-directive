angular.module('linkedinExample', [])
    .controller('linkedinExampleCtrl', ['$scope', '$http', 
        function($scope, $http) {

            $scope.linkedinMsg = {};
            $scope.showLinkedinLogin = true;
            $scope.showEmailForm = true;
            
            $scope.linkedinProfileDataCallback = function(data){
                console.log('profileDataCallback',data);
            };
            
        }
    ]);