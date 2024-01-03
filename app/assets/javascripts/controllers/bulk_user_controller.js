function BulkUserCtrl($scope, userService){
	$scope.editorOptions = {
		lineNumbers: true,
		readOnly: false,
		autofocus: true,
		mode: 'javascript'
	};
  $scope.input_type="list" //list=MIT List, csv=tuples
  $scope.bulk_input = "";
  $scope.txt_removed_students = 0;
  $scope.txt_added_students = 0;
  $scope.new_students = [];
  $scope.removed_students = [];
  $scope.error_msg = "";
  
  $scope.init=function(){
    userService.loadStudents(function(success,data){
      if(success){
        $scope.students = data;
      } else {
        console.log("error getting students from server");
      }
    });
  };
  /************************
  Add a group of students
  *************************/
  $scope.addStudents = function(){
    userService.addStudents($scope.new_students, function(success,data){
      if(success){
        $scope.students = data;
        $scope.validateInput();
      } else {
        console.log("Error adding students");
      }
    });
  };
  /*************************
  Remove a group of students
  **************************/
  $scope.removeStudents = function(){
    userService.removeStudents($scope.removed_students, function(success,data){
      if(success){
        $scope.students = data;
        $scope.validateInput();
      } else {
        console.log("Error removing students");
      }
    });
  }
  /************************
  Parse the input text to extract student information
  Compare the list of students supplied to the existing students
  ************************/
  $scope.validateInput = function(){
    var students = [];
    if($scope.input_type=='list')
      $scope.parseList();
    else
      $scope.parseCSV();
  };
  $scope.parseCSV=function(){
    //reset list of added students
    $scope.new_students = [];
    $scope.error_msg = "";
    //iterate over input to build list of students
    var students = [];
    var lines = $scope.bulk_input.split('\n');
    for (var i=0; i<lines.length;i++){
      var elems = lines[i].split(',');
      if(elems.length!=3 || elems[2]==''){
        $scope.error_msg = "Syntax error on line "+(i+1);
        return;
      }
      var student = new User();
      student.first_name = jQuery.trim(elems[1]);
      student.last_name = jQuery.trim(elems[0]);
      student.username = jQuery.trim(elems[2]);
      student.password = student.username;
      students.push(student);
    }
    //find all the students to add
    for(var i=0;i<students.length;i++){
      var match = false;
      for(var j=0;j<$scope.students.length;j++){
        if($scope.students[j].username==students[i].username){
          match=true;
          break;
        }
      }
      if(match==false){
        $scope.new_students.push(students[i]);
      }
    }
  }
  $scope.parseList= function(){
    //reset lists of removed and added students
    $scope.new_students = [];
    $scope.removed_students = [];
    $scope.error_msg="";
    //extract first and last name
    var re_name = /^\s*(\d+)\s*([\w\s-]+),\s*(\w+)/;
    //****OLD format??? ****
    //  [xxx] 6.131 [xxxx]@MIT.EDU
    //var re_status_athena = /(\w*)\s+6\.\d{3}\s*(\w*)@MIT.EDU$/
    var re_status_athena = /(\w*)@MIT.EDU$/
    //split input into lines
    var lines = $scope.bulk_input.split('\n');
    //iterate over input to build list of students
    var students = [];
    var num_dropped = 0;
    for(var i=0; i<lines.length;i++){
      var student = new User();
      student.role = 'student';
      var line = lines[i];
      var matches = line.match(re_name);
      if(matches==null){
        $scope.error_msg = "Syntax error on line "+(i+1);
        return;
      }
      student.first_name=matches[3];
      student.last_name=matches[2];
      //password is last 4 of MIT ID
      student.password = matches[1].slice(matches[1].length-4,matches[1].length)
      var matches = line.match(re_status_athena);
      if(matches==null){
        $scope.error_msg = "Syntax error on line "+(i+1);
        return;
      }
      student.username = matches[1];
      //ignore students that have dropped
       /**** OLD Format???****
      if(matches[1]!="DR" && matches[1]!="DE"){
        students.push(student);
      } else {
        num_dropped+=1;
      }
      ********/
      students.push(student)
    }
    //find all the students to add
    for(var i=0;i<students.length;i++){
      var match = false;
      for(var j=0;j<$scope.students.length;j++){
        if($scope.students[j].username==students[i].username){
          match=true;
          break;
        }
      }
      if(match==false){
        $scope.new_students.push(students[i]);
      }
    }
    //find all the students to remove
    for(var i=0;i<$scope.students.length;i++){
      var match = false;
      for(var j=0;j<students.length;j++){
        if($scope.students[i].username==students[j].username){
          match=true;
          break;
        }
      }
      if(match==false){
        $scope.removed_students.push($scope.students[i]);
        console.log("removing student");
      }
    }
    $scope.txt_added_students = students.length;
    $scope.txt_removed_students = num_dropped;
  }
}

BulkUserCtrl.$inject = ['$scope', 'userService'];


