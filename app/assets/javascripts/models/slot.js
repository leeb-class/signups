'use strict';
/**************
 * Slot
 * 
 * Encapsulates the slot server model on the client
 * Server populated parameters:
 * 	--local to the object--
 * 	id
 * 	ta
 * 	student
 * 	start_time
 *  event_id
 *  location
 * 	--dynamically inserted by the server--
 * 
 * Client populated parameters:
 *  start_date (forces the date of the start_time to meet the event constraints)
 */
function Slot(obj){

	obj = typeof obj == "undefined"?{}:obj;
	
	this.id = obj.id;
	this.event_id = obj.event_id;
	this.location = obj.location;
	
	if(obj.ta)
		this.ta = new User(obj.ta);
	else
		this.ta = null;
		
	if(obj.student)
		this.student = new User(obj.student);
	else
		this.student = null;
		
	if(obj.start_time){
		this.start_time = new Date(obj.start_time);
		this.start_date = new Date(obj.start_time);
	} else {
		this.start_time = new Date();
		this.start_date = new Date();
	}
}

//convert the object into strings only for storage on the server
Slot.prototype.calcStartTime=function(){
	var tmp = new Date(this.start_date);
	tmp.setMinutes(this.start_time.getMinutes());
	tmp.setHours(this.start_time.getHours());
	this.start_time = tmp;
	
};

