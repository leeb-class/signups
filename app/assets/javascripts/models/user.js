'use strict';
/**************
 * User
 * 
 * Encapsulates the user server model on the client
 * Server populated parameters:
 * 	--local to the object--
 * 	id
 * 	first_name
 * 	last_name
 * 	role
 * 	email
 * 	--dynamically inserted by the server--
 *  none
 * 
 * Client populated parameters:
 * none
 *
 */
function User(obj){

	obj = typeof obj == "undefined"?{}:obj;
	if(obj==null)
		obj = {}
		
	this.id = obj.id;
	this.first_name = obj.first_name;
	this.last_name = obj.last_name;
	this.role = obj.role;
	this.email = obj.email;
	this.username = obj.username;
}
