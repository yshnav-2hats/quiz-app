let questions = [];
let currentIndex = 0;
let score = 0;

function startQuiz() {
  currentIndex = 0;
  score = 0;
  document.getElementById("quizBox").innerHTML = "Loading questions...";

  fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      questions = data.results;
      showQuestion();
    })
    .catch(function (error) {
      document.getElementById("quizBox").innerHTML = "Failed to load questions.";
    });
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    document.getElementById("quizBox").innerHTML =
      "<p>Quiz finished!</p><p>Your score: " + score + " / " + questions.length + "</p>";
    return;
  }

  const question = questions[currentIndex];

  // combine correct and incorrect answers, then shuffle
  let answers = question.incorrect_answers.slice();
  answers.push(question.correct_answer);
  answers = shuffle(answers);

  let html = "<p>" + decodeHTML(question.question) + "</p>";

  answers.forEach(function (answer) {
    html += '<button class="answerBtn" data-answer="' + encodeURIComponent(answer) + '" onclick="checkAnswer(this)">' + decodeHTML(answer) + "</button><br>";
  });

  document.getElementById("quizBox").innerHTML = html;
}

function checkAnswer(clickedButton) {
  const answer = decodeURIComponent(clickedButton.getAttribute("data-answer"));
  const correct = questions[currentIndex].correct_answer;
  const allButtons = document.querySelectorAll(".answerBtn");

  allButtons.forEach(function (button) {
    button.disabled = true;
    const buttonAnswer = decodeURIComponent(button.getAttribute("data-answer"));

    if (buttonAnswer === correct) {
      button.classList.add("correct");
    } else if (button === clickedButton) {
      button.classList.add("wrong");
    }
  });

  if (answer === correct) {
    score++;
  }

  currentIndex++;

  setTimeout(showQuestion, 1200);
}

function shuffle(array) {
  return array.sort(function () {
    return Math.random() - 0.5;
  });
}

function decodeHTML(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}