function EventCtrl($scope, eventService, slotService, userService){
	
	$scope.event=null;
	$scope.slot = null;
	$scope.newSlotTime = null;
	$scope.newSlotDate = null;
	$scope.newSlotLocation = "";
	$scope.errors = [];
	$scope.admin = false;
	$scope.ta = false;
	$scope.user_id = null;
	
	$scope.availableTAs = [];  //admins can create slots for any TA or other admin
	$scope.taForSlot = null;   //what TA is assigned with the "add slot for" button 
	//once a TA is assigned, the next slot should auto fill with the same ta
	
	$scope.init = function(event_id){
		if(user_role=='admin')
			$scope.admin=true;
		if(user_role=="ta")
			$scope.ta = true;
		$scope.user_id = user_id;
		
		if(event_id){ //we are in the show view
			eventService.loadEvent(event_id,function(success,data){
				if(success){
					$scope.event = data;
					//initialize a new slot 
					$scope.slot = new Slot();
					$scope.slot.location = $scope.newSlotLocation;
					if($scope.newSlotTime){
						$scope.slot.start_time = new Date($scope.newSlotTime);
						//find the right event date for the start_date parameter
						for(var i=0;i<$scope.event.dates.length;i++){
							if($scope.newSlotDate.getTime()==$scope.event.dates[i].getTime()){
								$scope.slot.start_date = $scope.event.dates[i];
								break;
							}
						}
					} else {
						$scope.slot.start_time = new Date($scope.event.dates[0]);
						$scope.slot.start_date = $scope.event.dates[0];
						$scope.slot.start_time.setHours(13);
						$scope.slot.start_time.setMinutes(0);
					}
				}
				else
					console.log("error loading event");
			});
			if($scope.admin){
				//admins can create slots for any admin or TA
				userService.loadTAs(function(success,data){
					if(success){
						$scope.availableTAs = data;
						//find the current user to assign as the default TA
						//unless taForSlot is not null
						var ta_id = $scope.user_id;
						if($scope.taForSlot)
							ta_id = $scope.taForSlot.id;
						
						var error = true;
						for(var i=0;i<data.length;i++){
							if(data[i].id == ta_id){
								$scope.taForSlot = data[i];
								error = false;
								break;
							}
						}
						if(error){
							console.log("couldn't find current user in the available TAs");
						}
					}
					else
						console.log("error loading available TAs");
				});
			}
		}
		else 
			$scope.event = new Event();
	};
	
	//initializer for the edit view
	$scope.initEdit = function(event_id){
		eventService.loadEvent(event_id,function(success,data){
			if(success){
				$scope.event = event;
			} else {
				console.log("error loading event for editing");
			}
		});
	};
	
	$scope.createSlot = function(){
		$scope.errors = [];
		$scope.slot.calcStartTime();
		$scope.newSlotTime = new Date($scope.slot.start_time.getTime()+$scope.event.slot_length*60*1000);
		$scope.newSlotDate = $scope.slot.start_date;
		$scope.newSlotLocation = $scope.slot.location;
		if($scope.admin) //admins can assign slots to admins and TAs
			$scope.slot.ta = $scope.taForSlot;
			
		slotService.createSlot($scope.event, $scope.slot, function(success,data){
			if(success){
				$scope.init($scope.event.id);
			} else {
				$scope.errors = data;
			};
		});
	};
	$scope.deleteSlot = function(slot){
		slotService.deleteSlot(slot,function(success,data){
			if(success){
				$scope.init($scope.event.id);
			} else {
				console.log("error deleting slot");
			}
		});
	};
	$scope.removableSlot = function(slot){
		//return true if the user is an admin
		//or if the user is a ta that owns the slot
		//otherwise, return false
		if($scope.admin)
			return true;
		if($scope.ta && $scope.user_id==slot.ta.id)
			return true;
		return false;
	};
	
	$scope.assignSlot = function(slot){
		$scope.errors = [];
		slotService.saveSlot(slot,function(success,data){
			if(success){
				$scope.init($scope.event.id);
			} else {
				slot.student = null;
				console.log("error assigning slot");
			}
		});
	};
	
	$scope.removeSignup = function(slot){
		$scope.errors = [];
		slotService.removeSignup(slot, function(success,data){
			if(success)
				$scope.init($scope.event.id);
			else
				console.log("error removing signup");
		});
	};
	
	$scope.showEvent = function(){
		$scope.event.visible=true;
		eventService.saveEvent($scope.event,function(success,data){
			if(success){
				//$scope.init($scope.event.id);
			} else {
				console.log("error showing event");
			}
		});
	};
	
	$scope.hideEvent = function(){
		$scope.event.visible=false;
		eventService.saveEvent($scope.event,function(success,data){
			if(success){
				//$scope.init($scope.event.id);
			} else {
				console.log("error showing event");
			}
		});
	};
	//used by the new view
	$scope.createEvent = function(){
		eventService.createEvent($scope.event, function(success,data){
			if(success)
				window.location=config.base+"/events";
			else
				$scope.errors=data;
		});
	};
	//used by the edit view
	$scope.updateEvent = function(){
		eventService.saveEvent($scope.event, function(success,data){
			if(success)
				window.location=config.base+"/events/"+$scope.event.id;
			else
				$scope.errors=data;
		});
	};
}
EventCtrl.$inject = ['$scope', 'eventService','slotService','userService'];