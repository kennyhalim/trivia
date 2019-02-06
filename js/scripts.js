// Business Logic for TriviaGame
function TriviaGame() {
  this.triviaQuestions = []
}

TriviaGame.prototype.addTriviaQuestion = function(triviaQuestion) {
  this.triviaQuestions.push(triviaQuestion);
}

TriviaGame.prototype.getTriviaQuestion = function(questionType) {
  var triviaQuestionSet = [];
  for (var i=0; i< this.triviaQuestions.length; i++) {
    if (this.triviaQuestions[i]) {
      if (this.triviaQuestions[i].questionType === questionType && this.triviaQuestions[i].questionUsed === 0) {
        triviaQuestionSet.push(this.triviaQuestions[i]);
      }
    }
  }
  if (triviaQuestionSet.length == 0) {
    alert("gameover");
  }
  var questionNumber = Math.floor(Math.random() * triviaQuestionSet.length);
  return triviaQuestionSet[questionNumber];
}

TriviaGame.prototype.setQuestionUsed = function(questionId) {
  for (var i=0; i< this.triviaQuestions.length; i++) {
    if (this.triviaQuestions[i]) {
      if (this.triviaQuestions[i].questionId === questionId) {
        this.triviaQuestions[i].questionUsed = "1";
        break;
      }
    }
  }
}

//TriviaGame.prototype.checkCorrectness = function(question){}

// Business Logic for TriviaQuestions
function TriviaQuestion (questionId, imageURL, questionType, hint, answerOne, answerTwo, answerThree, answerFour, correctAnswer, questionUsed) {
  this.questionId = questionId,
  this.imageURL = imageURL,
  this.questionType = questionType,
  this.hint = hint,
  this.answerOne = answerOne,
  this.answerTwo = answerTwo,
  this.answerThree = answerThree,
  this.answerFour = answerFour,
  this.correctAnswer = correctAnswer,
  this.questionUsed = 0
}

// User Interface Logic
var triviaGame = new TriviaGame();
var currentQuestion;
var checkedAnswer;
var category;
var trackNumber = 1;
var score = 0;
var trackCorrect = 0;

function loadQuestions() {
  $.ajax({
        type: "GET",
        url: "data/trivia-questions.csv",
        dataType: "text",
        success: function(data) {processData(data);}
  });
}

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];

  for (var i=1; i<allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {
      var triviaQuestion = new TriviaQuestion(i, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
      triviaGame.addTriviaQuestion(triviaQuestion);
    }
  }
}

function playGame(category) {
  $(".question").text(trackNumber);

  currentQuestion = triviaGame.getTriviaQuestion(category);
  $("#question-hint").text(currentQuestion.hint);
  $("#question-image").html("<img src=" + currentQuestion.imageURL +">");
  //console.log(currentQuestion);
  if(currentQuestion){
    triviaGame.setQuestionUsed(currentQuestion.questionId);
  }

  $("#box1").text(currentQuestion.answerOne);
  $("#box2").text(currentQuestion.answerTwo);
  $("#box3").text(currentQuestion.answerThree);
  $("#box4").text(currentQuestion.answerFour);
  trackNumber += 1;
}

function checkAnswer(answer){
  if(answer == currentQuestion.correctAnswer){
    alert("correct");
    score += 500;
    trackCorrect += 1;
    $("#score").text(score);
    $("#numOfCorrectAnswer").text(trackCorrect)
  } else {
    alert("wrong");
    $("#numOfCorrectAnswer").text()
  }
}

$(document).ready(function() {
  //attachContactListeners();
  loadQuestions();
  // var triviaQuestion = new TriviaQuestion("1","img/thermalSprings.jpg","where","Turkey","Pamukkale","Diamond Fork Springs","Travertine Springs","Terme di Saturnia Springs","1");
  // triviaGame.addTriviaQuestion(triviaQuestion);
  // var triviaQuestion2 = new TriviaQuestion("2","img/thermalSprings.jpg","where","Turkey","Test","Test Springs","Test Springs","Test di Saturnia Springs","1");
  // triviaGame.addTriviaQuestion(triviaQuestion2);

  $("#category-button button").click(function() {
    //get category the user selected
    category = $("#category-selection input[name='category']:checked").val();
    playGame(category);
  })

  $("#checkButton").click(function() {
    checkedAnswer = $("#question-answers input[name='answer']:checked").val();
    console.log(checkedAnswer);
    checkAnswer(checkedAnswer);
  })
});
