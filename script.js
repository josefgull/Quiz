let questions = [];
let currentQuestion = 0;
let score = 0;
let selected = false; // Flag to check if an answer has been selected

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        questions = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    if (questions.length === 0) {
        console.error('Questions not loaded.');
        return;
    }

    selected = false; // Reset the flag for a new question

    const questionElement = document.getElementById('question');
    const answerElements = [
        document.getElementById('answer0'),
        document.getElementById('answer1'),
        document.getElementById('answer2'),
        document.getElementById('answer3')
    ];

    document.getElementById('question-number').textContent = currentQuestion + 1;

    questionElement.textContent = questions[currentQuestion].question;
    answerElements.forEach((element, index) => {
        const label = element.querySelector('label');
        label.textContent = questions[currentQuestion].answers[index];
        element.style.backgroundColor = '';
        element.style.color = '';
        element.style.pointerEvents = 'auto'; // Re-enable pointer events
    });

    MathJax.typeset();
}

function checkAnswer(selectedAnswer) {
    if (selected) return; // If an answer is already selected, do nothing

    selected = true; // Set the flag to true to prevent further selections

    const resultElement = document.getElementById('result');
    const answerElements = [
        document.getElementById('answer0'),
        document.getElementById('answer1'),
        document.getElementById('answer2'),
        document.getElementById('answer3')
    ];

    answerElements.forEach((element, index) => {
        if (index === questions[currentQuestion].correct) {
            element.style.backgroundColor = '#5cb85c';
            element.style.color = '#fff';
        } else {
            element.style.backgroundColor = '#d9534f';
            element.style.color = '#fff';
        }
        element.style.pointerEvents = 'none'; // Disable further clicks
    });

    if (selectedAnswer === questions[currentQuestion].correct) {
        resultElement.textContent = "Correct!";
        score++;
    } else {
        resultElement.textContent = "Wrong answer.";
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
        document.getElementById('result').textContent = "";
    } else {
        showEndScreen();
    }
}

function showEndScreen() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('score').textContent = `You scored ${score} out of ${questions.length}`;
}

function restartQuiz() {
    score = 0;
    currentQuestion = 0;
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    document.getElementById('start-screen').style.display = 'block';
});
