'use strict';
var serviceModule = angular.module('myApp.services.slots',[]);

serviceModule.
  factory('slotService', ['$http',function($http){
  	
  	var slotService = {
  	
			createSlot: function(event,slot, callback){
				$http({
					"method": "POST",
					"url": config.base+'/events/'+event.id+"/slots.json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": slot
				}).success(function(data){
					callback(true, new Slot(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			saveSlot: function(slot, callback){
				$http({
					"method": "PUT",
					"url": config.base+'/events/'+slot.event_id+'/slots/'+slot.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": slot
				}).success(function(data){
					callback(true, new Slot(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			signup: function(slot, callback){
				$http({
					"method": "PUT",
					"url": config.base+'/events/'+slot.event_id+'/slots/'+slot.id+'/signup.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")}
				}).success(function(data){
					callback(true,null);
				}).error(function(data){
					callback(false,data);
				});
			},
			removeSignup: function(slot, callback){
				$http({
					"method": "PUT",
					"url": config.base+'/events/'+slot.event_id+'/slots/'+slot.id+'/remove_signup.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")}
				}).success(function(data){
					callback(true,null);
				}).error(function(data){
					callback(false,data);
				});
			},
			deleteSlot: function(slot, callback){
				$http({
					"method": "DELETE",
					"url": config.base+'/events/'+slot.event_id+'/slots/'+slot.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")}
				}).success(function(data){
					callback(true, null);
				}).error(function(data){
					callback(false,data);
				});
			}
  	};
  	return slotService;
  }]);
  