let questions = [];
let currentQuestion = 0;
let score = 0;
let selected = false; // Flag to check if an answer has been selected

async function loadQuestions(topic) {
    try {
        const response = await fetch(`${topic}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        questions = await response.json();
        loadQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function startQuiz(topic) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-title').textContent = `Quiz: ${topic.replace('_', ' ')}`;
    loadQuestions(topic);
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

    document.getElementById('question-container').style.display = 'block';
    document.getElementById('next-button').style.display = 'none'; // Hide Next button initially

    questionElement.textContent = `Q ${currentQuestion + 1}: ${questions[currentQuestion].question}`;
    answerElements.forEach((element, index) => {
        const label = element.querySelector('label');
        label.textContent = questions[currentQuestion].answers[index];
        element.style.backgroundColor = ''; // Reset color
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

    document.getElementById('next-button').style.display = 'block'; // Show Next button
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
    document.getElementById('score').textContent = `You scored ${score} out of ${questions.length}.`;
    if (score === 10) {
        document.getElementById('congrats-gif').style.display = 'block';
    }
}

function restartQuiz() {
    score = 0;
    currentQuestion = 0;
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
}
