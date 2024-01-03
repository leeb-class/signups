'use strict';

/* Filters */
var app=angular.module('myApp.filters', []);

app.filter('test', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

app.filter('checkmark', function(){
	return function(input){
		if(input){
			return "<i class='icon-ok'></i>";
		} 
		else 
			return "";
	};
});

app.filter('errorClass', function(){
	return function(input){
		if(input!=null && input!=""){
			return "has-error";
		} 
		else 
			return "";
	};
});
app.filter('warningClass', function(){
	return function(input){
		if(input!=null && input!=""){
			return "text-warning";
		} 
		else 
			return "";
	};
});


app.filter('dateRange', function(){
	return function(range){
		if(range==null)
			return "N/A";
		if(range.start==null || range.end==null)
			return "N/A";
		if(range.start.getMonth()==range.end.getMonth() &&
			 range.start.getDate() == range.end.getDate())
			 return range.start.format("dd mmm");
		else
			return range.start.format("dd mmm") + " - "+range.end.format("dd mmm");
	};
});


app.filter('name', function(){
	return function(user){
		if(user==null)
			return "--";
		else
			return user.first_name+" "+user.last_name;
	};
});

app.filter('names', function(){
	return function(users){
		if(users==null || users.length==0)
			return "--";
		var names = [];
		for(var i=0;i<users.length;i++){
			names.push(users[i].first_name+" "+users[i].last_name);
		}
		return names.join(", ");
	};
});
app.filter('emails', function(){
	return function(users){
		if(users==null || users.length==0)
			return "--";
		var emails = [];
		for(var i=0;i<users.length;i++){
			emails.push(users[i].email);
		}
		return emails.join(",");
	};
});

app.filter('abbrevDate', function(){
	return function(date){
		return date.format("dd mmm");
	};
});

app.filter('time', function(){
	return function(date){
		return date.format("dd mmm h:MM TT");
	};
});