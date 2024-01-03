'use strict';
/**************
 * Submission
 * 
 * Encapsulates the submission server model on the client
 * Server populated parameters:
 * 	--local to the object--
 * 	id
 * 	user
 * 	valid
 *  file
 * 
 * Client populated parameters:
 *  
 */
function Submission(obj){

	obj = typeof obj == "undefined"?{}:obj;
	
	this.id = obj.id;
	this.user = new User({id: obj.user_id});
	this.valid = obj.valid;
	this.file = obj.file;
  if(this.file!=null){
    this.file.url = config.base+this.file.url
  }
}
