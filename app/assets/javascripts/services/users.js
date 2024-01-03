'use strict';
var serviceModule = angular.module('myApp.services.user',[]);

serviceModule.
  factory('userService', ['$http',function($http){
  	
  	var userService = {
  		loadUsers: function(callback){
				var users=[];
				$http({
					"method": "GET",
					"url": config.base+'/users.json',
				}).success(function(data){
						for(var i=0;i<data.length;i++){
							data[i]=new User(data[i]);
						}
						callback(true,data);
				}).error(function(data){
					callback(false,data);
				});
			},
		  loadStudents: function(callback){
				var users=[];
				$http({
					"method": "GET",
					"url": config.base+'/users.json?type=student',
				}).success(function(data){
						for(var i=0;i<data.length;i++){
							data[i]=new User(data[i]);
						}
						callback(true,data);
				}).error(function(data){
					callback(false,data);
				});
			},
			
			loadTAs: function(callback){
				var users=[];
				$http({
					"method": "GET",
					"url": config.base+'/users.json',
					"params": {type: "ta_or_admin"}
				}).success(function(data){
						for(var i=0;i<data.length;i++){
							data[i]=new User(data[i]);
						}
						callback(true,data);
				}).error(function(data){
					callback(false,data);
				});
			},
			createUser: function(user, callback){
				$http({
					"method": "POST",
					"url": config.base+'/users.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": user
				}).success(function(data){
					callback(true, new User(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			saveUser: function(user, callback){
				$http({
					"method": "PUT",
					"url": config.base+'/users/'+user.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": user
				}).success(function(data){
					callback(true, new User(data));
				}).error(function(data){
					callback(false, data);
				});
			},
			deleteUser: function(user, callback){
				$http({
					"method": "DELETE",
					"url": config.base+'/users/'+user.id+".json",
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")}
				}).success(function(data){
					callback(true, null);
				}).error(function(data){
					callback(false,data);
				});
			},
      ///***Bulk Functions***///
      removeStudents: function(students, callback){
				$http({
					"method": "POST",
					"url": config.base+'/users/bulk_remove.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": {"students": students}
				}).success(function(data){
            for(var i=0;i<data.length;i++){
              data[i]=new User(data[i]);
            }
            callback(true, data);
				}).error(function(data){
					callback(false, data);
				});
      },
      addStudents: function(students, callback){
				$http({
					"method": "POST",
					"url": config.base+'/users/bulk_add.json',
					"headers": {'X-CSRF-Token': $("meta[name=csrf-token]").first().attr("content")},
					"data": {"students": students}
				}).success(function(data){
            for(var i=0;i<data.length;i++){
              data[i]=new User(data[i]);
            }
            callback(true, data);
				}).error(function(data){
					callback(false, data);
				});
      }
		};
		return userService;
  }]);
  