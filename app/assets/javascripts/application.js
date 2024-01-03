// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//

//= require lib/jquery
//= require lib/bootstrap
//= require lib/codemirror
//= require lib/angular
//= require lib/date.format

//= require ./services
//= require ./directives
//= require ./controllers
//= require ./models

//= require_directory ./


'use strict';


// Declare app level module which depends on filters, and services
var app= angular.module('myApp', 
	['myApp.filters','myApp.services.user','myApp.services.events','myApp.services.slots',
	 'myApp.services.submissions','myApp.directives.misc', 'ui.bootstrap','ui.codemirror']);
	 
