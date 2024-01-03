function UserCtrl($scope, $window, userService){
	
	$scope.busy=false;
	$scope.dialog=null;
	
	$scope.predicate = "last_name";
	$scope.reverseOrder = false; //wether the current sort is reversed or not
	$scope.reversed = { //toggle states of sorting
		"last_name": false,
		"email": false,
		"role": false
	};
	
	$scope.users=[];
	
	$scope.refresh = function(){
		userService.loadUsers(function(success,data){
			if(success){
				$scope.users=data;
			} else {
				console.log("error loading users");
			}
		});
	};
	
	$scope.deleteUser = function(user){
		userService.deleteUser(user,function(){
			$scope.refresh();
		});
	};
	
	
	
	$scope.create = function(action,hide){
		userService.createUser($scope.user, function(success,data){
			if(success){
				switch(action){
					case "redirect":
				    window.location=config.base+"/";
						break;
					case "refresh":
						$scope.refresh();
						hide();
						break;
					}
				}
			else{
				$scope.errors=data;
			}
		});
	};
	
	$scope.editUser = function(user){
		$window.location.href = config.base+"/users/"+user.id+"/edit";
	};
	
	$scope.isSaveable = function(){
		if(angular.equals($scope.user_orig,$scope.user_edit) || $scope.busy)
			return false;
		return true;
	};
	
	$scope.reset = function(){
		$scope.user_edit = angular.copy($scope.user_orig);
	};
	
	$scope.cancel = function(hide){
		if(!$scope.busy){
			$scope.reset();
			$scope.errors={};
			hide();
		}
	};
	
	$scope.save = function(hide){
		$scope.busy=true;
		$scope.errors={};
		userService.saveUser($scope.user_edit, function(success,data){
			$scope.busy=false;
			if(success){
				$scope.refresh();
				hide();
			} else{
				$scope.errors=data;
			}
		});
	};
	
	$scope.sortBy = function(field){
		//dynamically sort the users by different fields
		$scope.reversed[field]=!$scope.reversed[field];
		$scope.predicate = ($scope.reversed[field]?'-':'+')+field;
	};
		
};
UserCtrl.$inject = ['$scope', '$window', 'userService'];