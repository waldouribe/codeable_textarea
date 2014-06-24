var Exercise = function(attributes){
  this.answer = attributes.answer;
  this.tests = attributes.tests;
  this.error_feedback_id = attributes.error_feedback_id
  this.errorCallback = attributes.errorCallback
  this.passedSingleTest = attributes.passedSingleTest
  this.failedSingleTest = attributes.failedSingleTest
  this.passedEveryTest = attributes.passedEveryTest
}

Exercise.prototype.runTests = function(){
  var are_test_passing = true;
  if(this.isExecutable()){
    for(var test_index=0; test_index<this.tests.length; test_index++)
    if(this.isIthTestPassing(test_index))
      this.passedSingleTest(this.tests[test_index].feedback_id);
    else{
      this.failedSingleTest(this.tests[test_index].feedback_id, convertToString(this.evalActualOfTest(test_index)), this.tests[test_index].expected);
      are_test_passing = false;
    }  
    if(are_test_passing) this.passedEveryTest();
  }
  else
    this.errorCallback(this.error_feedback_id, this.executionErrors());
}

Exercise.prototype.evalActualOfTest = function(test_index) {
  return eval(this.answer+";"+this.tests[test_index].actual);  
}

Exercise.prototype.isIthTestPassing = function(test_index){
  var test = this.tests[test_index];
  var execution_string = this.answer + ";" + "equals("+test.actual+", "+test.expected+");";
  console.log(execution_string);
  return eval(execution_string);
}

Exercise.prototype.isExecutable = function(){
  var is_executable = true;
  try{
    eval(this.executionString());
  }
  catch(error){
    is_executable = false;
  }
  return is_executable;
}

Exercise.prototype.executionString = function(){
  return this.answer + ";" + this.testsAsExecutionString();
}

Exercise.prototype.testsAsExecutionString = function(){
  var executable_string = "";
  for(var i=0; i<this.tests.length; i++){
    executable_string += "equals("+this.tests[i].expected+", "+this.tests[i].actual+");";
  }
  return executable_string;
}

Exercise.prototype.executionErrors = function(){
  var error_message = "";
  try{
    eval(this.executionString());
  }
  catch(error){
    error_message = error;
  }
  return error_message;
}

equals = function(an_object, another_object){
  return convertToString(an_object) == convertToString(another_object);
}

convertToString = function(object_to_covnvert) {
  var prop, string, type;
  string = [];
  type = Object.prototype.toString.call(object_to_covnvert);
  if (type === '[object Object]') {
    string.push("{");
    for (prop in object_to_covnvert) {
      string.push(prop, ": ", convertToString(object_to_covnvert[prop]), ', ');
    }
    if (Object.keys(object_to_covnvert).length >= 1) {
      string.pop();
    }
    string.push("}");
  } else if (type === '[object Array]') {
    string.push("[");
    for (prop in object_to_covnvert) {
      string.push(convertToString(object_to_covnvert[prop]), ', ');
    }
    if (object_to_covnvert.length >= 1) {
      string.pop();
    }
    string.push("]");
  } else if (typeof object_to_covnvert === "function") {
    string.push(object_to_covnvert.toString());
  } else {
    string.push(JSON.stringify(object_to_covnvert));
  }
  return string.join("");
};

$.widget("codeandsmile.code_textarea", {
  options: {
    tests: [],
    tests_feedback_ids: [],
    error_feedback_id: 'error_feedback',
    passedSingleTest: function(test_feedback_id){ console.debug("$('#"+test_feedback_id+"') should show that the test is passing"); },
    failedSingleTest: function(test_feedback_id, actual, expected){ console.debug("$('#"+test_feedback_id+"') should show that the test is failing."); },
    passedEveryTest: function(){ console.debug("GOOD: Every test is passing"); },
    errorCallback: function(error_feedback_id, error_message){ console.debug(error_message + " should be displayed at #error_feedback"); }
  },
  exercise: null,
  _create: function() {
    this.exercise = new Exercise({
                    answer: this.element.val(), 
                    tests: this.options.tests,
                    passedSingleTest: this.options.passedSingleTest,
                    failedSingleTest: this.options.failedSingleTest,
                    passedEveryTest: this.options.passedEveryTest,
                    errorCallback: this.options.errorCallback,
                    error_feedback_id: this.options.error_feedback_id
                  });
  },
  runTests: function() {
    this.exercise.answer = this.element.val();
    this.exercise.runTests();
  }
});
