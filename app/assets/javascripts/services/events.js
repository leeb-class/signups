'use strict';
var serviceModule = angular.module('myApp.services.events',[]);

serviceModule.
  factory('eventService', ['$http',function($http){
  	
  	var eventService = {
  		loadEvents: function(callback){
				var events=[];
				$http({
					"method": "GET",
					"url": config.base+'/events.json',
				}).success(function(data){
						for(var i=0;i<data.length;i++){
							data[i]=new Event(data[i]);
						}
						callback(true,data);
				}).error(function(data){
					callback(false,data);
				});
			},
			loadEvent: function(id,callback){
				var events=[];
				$http({
					"method": "GET",
					"url": config.base+'/events/'+id+".json",
				}).success(function(data){
						callback(true,new Event(data));
				}).error(function(data){
					callback(false,data);
				});
			},
			createEvent: function(event, callback){
				$http({
					"method": "POST",
					"url": config.base+'/events.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": event.serialize()
				}).success(function(data){
					callback(true, new Event(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			saveEvent: function(event, callback){
				$http({
					"method": "PUT",
					"url": config.base+'/events/'+event.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": event.serialize()
				}).success(function(data){
					callback(true, new Event(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			deleteEvent: function(event, callback){
				$http({
					"method": "DELETE",
					"url": config.base+'/events/'+event.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")}
				}).success(function(data){
					callback(true, null);
				}).error(function(data){
					callback(false,data);
				});
			}
  	};
  	return eventService;
  }]);
 'use strict';


		