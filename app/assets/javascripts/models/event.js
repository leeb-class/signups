'use strict';
/**************
 * Event
 * 
 * Encapsulates the event server model on the client
 * Server populated parameters:
 * 	--local to the object--
 * 	id
 * 	name
 * 	start_date
 *  end_date
 *  slot_length
 *  black_out_times: array of [Date,Date] objects (encoded as JSON on the server) **NOT USED**
 *  visible
 *  student_per_slot
 *  has_submissions
 *  submission_deadline
 * 
 * --dynamically populated by the server--
 *  slots
 *  missing_students
 *  missing_submissions

 * Client populated parameters:
 * slots_filled
 * slots_available
 * dates *array of Date objects, one for each day of the event*
 * 
 */
function Event(obj){

	obj = typeof obj == "undefined"?{}:obj;
	
	this.id = obj.id;
	this.name = obj.name;
	this.slots = [];
	this.slots_filled = 0;
	this.slots_available = 0;
	this.missing_students = [];
	this.missing_submissions = [];
	this.has_submissions = obj.has_submissions;
	this.submission_deadline = new Date(obj.submission_deadline);
	//flag set if this is a student requesting the event
	this.submission_complete = obj.submission_complete; 
	//
	this.visible = obj.visible;
	if(this.visible==null)
		this.visible=false;
		
	if(obj.missing_students){
		for(var i=0;i<obj.missing_students.length;i++){
			this.missing_students.push(new User(obj.missing_students[i]));
		}
	}
	if(obj.missing_submissions){
		for(var i=0;i<obj.missing_submissions.length;i++){
			this.missing_submissions.push(new User(obj.missing_submissions[i]));
		}
	}
	if(obj.slots){
		for(var i=0;i<obj.slots.length;i++){
			var slot = new Slot(obj.slots[i]);
			if(slot.student == null)
				this.slots_available++;
			else
				this.slots_filled++;
			this.slots.push(slot);
		}
	}
	
	if(obj.slot_length)
		this.slot_length = obj.slot_length;
	else
		this.slot_length = 15;
		
	if(obj.start_date)
		this.start_date = new Date(obj.start_date);
	else
		this.start_date = null;
	if(obj.end_date)
		this.end_date = new Date(obj.end_date);
	else
		this.end_date = null;
	if(obj.black_out_times)
		this.black_out_times = JSON.parse(obj.black_out_times);
	else
		this.black_out_times = [];
	if(obj.students_per_slot)
		this.students_per_slot = obj.students_per_slot;
	else
		this.students_per_slot = 1;

	//build up the dates array
	this.dates = [];
	if(this.start_date && this.end_date){
		var date = new Date(this.start_date);
		while(date<this.end_date){
			this.dates.push(new Date(date));
			date.setHours(date.getHours()+24);
		}
	}
}

Event.prototype.dateRange = function(){
	return {start: this.start_date,
		      end: this.end_date};
};
//convert the object into strings only for storage on the server
Event.prototype.serialize=function(){
	//convert the start date to the beginning of the day
	//and the end date to the end of the day
	if(this.end_date){
		this.end_date.setHours(23);
		this.end_date.setMinutes(59);
	}
	if(this.start_date){
		this.start_date.setHours(0);
		this.start_date.setMinutes(0);
	}
	
	return{
		name: this.name,
		start_date: this.start_date,
		end_date: this.end_date,
		slot_length: this.slot_length,
		visible: this.visible,
		black_out_times: JSON.stringify(this.black_out_times),
		students_per_slot: this.students_per_slot,
		has_submissions: this.has_submissions,
		submission_deadline: this.submission_deadline
	};
		
};

