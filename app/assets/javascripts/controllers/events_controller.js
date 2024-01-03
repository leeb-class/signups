function EventsCtrl($scope, $window, eventService){
	
	$scope.busy=false;
	$scope.dialog=null;
	$scope.events=[];
	$scope.admin = false;
	$scope.ta = false;
	
	$scope.refresh = function(){
		if(user_role=="admin")
			$scope.admin=true;
		if(user_role=="ta")
			$scope.ta = true;
		eventService.loadEvents(function(success,data){
			if(success){
				$scope.events=data;
			} else {
				console.log("error loading events");
			}
		});
	};
	
	$scope.deleteEvent = function(event){
		eventService.deleteEvent(event,function(){
			$scope.refresh();
		});
	};
	
	
	
	
	
	$scope.showEvent = function(event){
		if($scope.admin || $scope.ta)
			$window.location.href = config.base+"/events/"+event.id;
		else
			$window.location.href = config.base+"/events/"+event.id+"/signup";
	};
	
	$scope.isSaveable = function(){
		if(angular.equals($scope.event_orig,$scope.event_edit) || $scope.busy)
			return false;
		return true;
	};
	
	$scope.reset = function(){
		$scope.event_edit = angular.copy($scope.event_orig);
	};
	
	$scope.cancel = function(hide){
		if(!$scope.busy){
			$scope.reset();
			$scope.errors={};
			hide();
		}
	};
	
	
};
EventsCtrl.$inject = ['$scope', '$window', 'eventService'];