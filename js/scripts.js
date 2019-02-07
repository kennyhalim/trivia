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
    $("#result").show();
    $("#container-question").hide();
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
var countHint = 5;

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

var downloadTimer;

function timer(){
  var timeleft = 30;
  downloadTimer = setInterval(function(){
  timeleft--;

  document.getElementById("countdown").innerHTML = "Timer : " + timeleft;
    if(timeleft <= 0){
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = "Your time is up";
      $("#question-button button").show();
      $("#checkButton button").hide();
    }
  }, 1000);
}

function stopTimer(){
  clearInterval(downloadTimer);
}

function playGame(category) {
  if(trackNumber < 20){
  $("#question").text("Question " + trackNumber);
} else if (trackNumber = 20){
  trackNumber = 20;
  $("#question").text("Question " + trackNumber);
}
  currentQuestion = triviaGame.getTriviaQuestion(category);

  if(currentQuestion){
    $("input:radio[name=answer]").prop('checked',false);
    $("#question-hint").text(currentQuestion.hint);
    $("#question-image").html("<img src=" + currentQuestion.imageURL +">");
    triviaGame.setQuestionUsed(currentQuestion.questionId);
    $("#box1").text(currentQuestion.answerOne);
    $("#box2").text(currentQuestion.answerTwo);
    $("#box3").text(currentQuestion.answerThree);
    $("#box4").text(currentQuestion.answerFour);
    trackNumber += 1;
  }
}

function checkAnswer(answer){
  if(answer == currentQuestion.correctAnswer){
    $("#answer-confirmation img").attr("src", "img/checkmark.png");
    score += 500;
    trackCorrect += 1;
    $("#score").text("Your score: " + score);
    $("#numOfCorrectAnswer").text(trackCorrect);
  } else {
    var answer;
    if (currentQuestion.correctAnswer === "1") {
      answer = currentQuestion.answerOne;
    } else if (currentQuestion.correctAnswer === "2"){
      answer = currentQuestion.answerTwo;
    } else if (currentQuestion.correctAnswer === "3"){
      answer = currentQuestion.answerThree;
    } else if (currentQuestion.correctAnswer === "4"){
      answer = currentQuestion.answerFour;
    }
    $("#correctAnswer").html("The correct answer is: <br>" + answer);
    $("#correctAnswer").show();
    $("#answer-confirmation img").attr("src", "img/xmark.png");

  }

  $("#answer-confirmation").show();
}

$(document).ready(function() {

  loadQuestions();

  $("#category-button button").click(function() {
    //get category the user selected
    category = $("#category-selection input[name='category']:checked").val();
    categoryText = $("#category-selection input[name='category']:checked").parent().text();
    if(category){
      playGame(category);
      timer();
      $("#question-category").text(categoryText);
      $("#checkButton button").show();
      $("#question-button button").hide();
      $("#container-welcome").hide();
      $("#project-description").hide();
      $("#answer-confirmation").hide();
      $("#container-question").show();
      $("#hintCounter").text("Hint left: " + countHint);
      $("#score").text("Your score: " + score);
    } else {
      alert("Please select a category");
    }
  })

  $("#checkButton button").click(function() {
    checkedAnswer = $("#question-answers input[name='answer']:checked").val();
    if(checkedAnswer){
    stopTimer();
    checkAnswer(checkedAnswer);
    $("#checkButton button").hide();
    $("#question-button button").show();
  } else {
    alert("Please choose an answer");
  }
  })

  $("#question-button button").click(function(){
    playGame(category);
    timer();
    $("#checkButton button").show();
    $("#question-button button").hide();
    $("#answer-confirmation").hide();
    $("#correctAnswer").hide();
  });

  $("#mainMenu").click(function(){
    location.reload();
  });


  $("#showHint").click(function(){
    if (countHint == 1) {
      $("#showHint").hide();
    }
    countHint--;
    alert(currentQuestion.hint);
    $("#hintCounter").text("Hint left: " + countHint);
  });
});
