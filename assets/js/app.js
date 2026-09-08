let questions = [];
let currentIndex = 0;
let score = 0;

function startQuiz() {
    currentIndex = 0;
    score = 0;
    document.getElementById("quizBox").innerHTML = "Loading questions...";

    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            questions = data.results;
            showQuestions();
        })
        .catch(function (error) {
            document.getElementById("quizBox").innerHTML = "Failed to load questions.";
        });
}

function showQuestions() {
    if (currentIndex >= questions.length) {
        document.getElementById("quizBox").innerHTML = "<p>Quiz finished!</p><p>Your score: " + score + "/" + questions.length + "</p>";
        return;
    }

    const question = questions[currentIndex];

    let answers = question.incorrect_answers.slice();
    answers.push(question.correct_answer);
    answers = shuffle(answers);

    let html = "<p>" + decodeHTML(question.question) + "</p>";

    answers.forEach(function (answer) {
        html += '<button onclick="checkAnswer(\'' + encodeURIComponent(answer) + '\')">' + decodeHTML(answer) + "</button><br>";
    });

    document.getElementById("quizBox").innerHTML = html;
}

function checkAnswer(encodedAnswer) {
    const answer = decodeURIComponent(encodedAnswer);
    const correct = questions[currentIndex].correct_answer;

    if (answer === correct) {
        score++;
    }

    currentIndex++;
    showQuestion();
}

function shuffle(array) {
    return array.sort(function () {
        return Math.random() - 0.5;
    });
}

function decodeHTML(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHtml = text;
    return textarea.value;
}