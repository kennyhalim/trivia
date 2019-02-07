function ContentPresentation() {

}

ContentPresentation.prototype.showMainPage = function() {
  var content = this;
  $("#container-question").hide();
  $("#container-results").hide();
  $("#container-welcome").show();
  $("#category-button button").click(function() {
    //get category the user selected
    var category = $("#category-selection input[name='category']:checked").closest('label').text();
    console.log(category);
    // alert(category);
    //get current question then show the questions on the question page
    content.showQuestionPage(null, 1, category);
  });
}

ContentPresentation.prototype.showQuestionPage = function(questions, index, category) {
  //mocking out the logic with the assumption that an arry of question object will be provided
  //the question object is assume to have a unique id and an array of answers.
  //each answer is assumed to have a unique id
  var content = this;
  var questionCount = 20;
  var questionNumber = index + 1;
  var questionText = "This is question " + questionNumber;
  var questionTitle = `Question (${questionNumber} of ${questionCount}): ${questionText}?`;
  var questionHint = `Hint: This is hint`;
  var answers = ["Thermal Springs", "Diamond Fork Springs", "Travertine Springs", "Terme di Saturnia Springs"];
  var answerHtml = "";
  var questionImage = "img/thermalSprings.jpg";

  for (var i = 0; i < answers.length; i++) {
    var answer = answers[i];
    var questionId = 1;
    var answerId = i;
    //answer:1:1 -> answer:<question id>:<answer id>
    answerHtml += `<input id="answer:${questionId}:${answerId}" type="radio" name="answer" value=""> ${answer}</input><br/>`
  }

  $("#question").text(questionTitle);
  $("#question-category").text(category);
  $("#question-hint").text(questionHint);
  $("#question-answers").html(answerHtml);
  $("#question-image img").attr("src", questionImage);


  $("#container-question").show();
  $("#container-welcome").hide();
  $(".project-description").hide();
  $("#container-results").hide();

  $("#question-button button").click(function() {
    content.showResultPage(null, category);
  });
}

ContentPresentation.prototype.showResultPage = function(questions, category) {
  $("#container-question").hide();
  $("#container-welcome").hide();
  $(".project-description").hide();
  $("#container-results").show();
}
