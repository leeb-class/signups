function SignupCtrl($scope, eventService, slotService, submissionService){
	
	$scope.init = function(event_id){
		$scope.event = null;
		$scope.slot = null;
		$scope.signup_enabled = true;
		$scope.submission = null;
		eventService.loadEvent(event_id,function(success,data){
					if(success){
						$scope.event = data;
						//go through the event slots to build up dates
						//and determine if the user has already signed up for a slot
						for(var i=0;i<$scope.event.slots.length;i++){
							if($scope.event.slots[i].student){
								if($scope.event.slots[i].student.id == user_id){
									$scope.slot = $scope.event.slots[i];
									$scope.signup_enabled = false;
								}
							}
						}
						//check to see if there is a submission for this event
						if($scope.event.has_submissions){
							submissionService.loadSubmission($scope.event, function(success,data){
								if(success){
									$scope.submission = data;
								} else {
									console.log("error loading submssion");
								}
							});
						} else{
							$scope.submission=null;
						}
					}
					else
						console.log("error loading event");
				});
		};
	$scope.changeable = function(slot){
		//only slots with start_times in the future can be changed
		if(slot==null)
			return false;
		var now = new Date();
		var curTime = now.getTime();
		if(slot.start_time.getTime()>curTime)
			return true;
		else 
			return false;
	};
	$scope.signup = function(slot){
		slotService.signup(slot,function(success,data){
			if(success){
				$scope.init($scope.event.id);
			} else {
				console.log("error signing up");
			}
		});
	};
	$scope.removeSignup = function(){
		slotService.removeSignup($scope.slot,function(success,data){
			if(success){
				$scope.init($scope.event.id);
			} else {
				console.log("error removing signup");
			}
		});
	};
	////////
	//File management routines for 
	//events with submissions
	$scope.removeSubmission = function(){
		submissionService.deleteSubmission($scope.submission, function(success,data){
			if(success){
				window.location.reload();
			} else{
				console.log("error removing submission");
			}
		});
	};
	$scope.acceptingSubmissions = function(){
		var now = new Date();
		if($scope.event==null)
			return false;
		if(now<=$scope.event.submission_deadline)
			return true;
		else
			return false;
	};
}

SignupCtrl.$inject = ['$scope', 'eventService', 'slotService', 'submissionService'];