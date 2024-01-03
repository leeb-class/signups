'use strict';
var serviceModule = angular.module('myApp.services.submissions',[]);

serviceModule.
  factory('submissionService', ['$http',function($http){
  	
  	var submissionService = {
  		loadSubmissions: function(event, callback){
				var users=[];
				$http({
					"method": "GET",
					"url": config.base+'/submissions.json',
				}).success(function(data){
						for(var i=0;i<data.length;i++){
							data[i]=new User(data[i]);
						}
						callback(true,data);
				}).error(function(data){
					callback(false,data);
				});
			},	
			loadSubmission: function(event, callback){
				$http({
					"method": "GET",
					"url": config.base+'/submissions.json',
					"params": 
						{	
							event_id: event.id
						}
				}).success(function(data){
						if(data=="null")
							data = null;
						else
							data = new Submission(data);
						callback(true,data);
				}).error(function(data){
					callback(false,data);
				});
			},
			createSubmission: function(user, event, submission, callback){
				$http({
					"method": "POST",
					"url": config.base+'/submissions.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": {
						user_id: user.id,
						event_id: event.id,
						submission: submission
					}
				}).success(function(data){
					callback(true, new Submission(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			
			deleteSubmission: function(submission, callback){
				$http({
					"method": "DELETE",
					"url": config.base+'/submissions/'+submission.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")}
				}).success(function(data){
					callback(true, null);
				}).error(function(data){
					callback(false,data);
				});
			}
		};
		return submissionService;
  }]);
  
