var app=angular.module('myApp.directives.misc', []);

app.directive('confirmable', ['$compile', function($compile){
	'use strict';
	return {
		restrict: 'A',
		replace: false,
		scope: {
			action: '&',
			placement: '@',
		},
		transclude: false,
		link: function linkFn(scope, element, attrs, controller){
			if(attrs.placement == null)
				attrs.placement="bottom";
			$(element).click(function(){
				$(element).popover({
					title: "Are you sure?",
					content: $compile('<button class="btn btn-primary" ng-click="confirm()">Yes</button>  '+
								 '<button class="btn btn-default" ng-click="cancel()">Cancel</button>')(scope),
					html: true,
					trigger: "manual",
					placement: attrs.placement 
				});
				$(element).popover('show');
			});
			scope.cancel = function(){
				$(element).popover('destroy');
			};
			scope.confirm = function(){
				$(element).popover('destroy');
				scope.action();
			};
		}
	};
}]);