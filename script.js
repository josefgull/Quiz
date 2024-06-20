let questions = [
    {
        "question": "What is \\( \\int_0^1 x^2 \\, dx \\) ?",
        "answers": [
            "\\( \\frac{1}{3} \\)",
            "\\( \\frac{1}{2} \\)",
            "\\( \\frac{1}{4} \\)",
            "\\( \\frac{2}{3} \\)"
        ],
        "correct": 0
    },
    {
        "question": "Solve for \\( x \\): \\( x^2 - 4 = 0 \\)",
        "answers": [
            "\\( x = 0 \\)",
            "\\( x = 2 \\)",
            "\\( x = \\pm 2 \\)",
            "\\( x = -2 \\)"
        ],
        "correct": 2
    }
];
let currentQuestion = 0;
let score = 0;

// Load questions from the questions.json file
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

// Start the quiz by displaying the first question
function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    loadQuestion();
}

// Load the current question and its answers
function loadQuestion() {
    if (questions.length === 0) {
        console.error('Questions not loaded.');
        return;
    }

    const questionElement = document.getElementById('question');
    const answerElements = [
        document.getElementById('answer0'),
        document.getElementById('answer1'),
        document.getElementById('answer2'),
        document.getElementById('answer3')
    ];

    // Update the question number
    document.getElementById('question-number').textContent = currentQuestion + 1;

    questionElement.textContent = questions[currentQuestion].question;
    answerElements.forEach((element, index) => {
        const label = element.querySelector('label');
        label.textContent = questions[currentQuestion].answers[index];
        element.style.backgroundColor = ''; // Reset background color
        element.style.color = ''; // Reset text color
    });

    MathJax.typeset(); // Render LaTeX equations using MathJax
}

// Check if the selected answer is correct
function checkAnswer(selected) {
    const resultElement = document.getElementById('result');
    const answerElements = [
        document.getElementById('answer0'),
        document.getElementById('answer1'),
        document.getElementById('answer2'),
        document.getElementById('answer3')
    ];

    answerElements.forEach((element, index) => {
        if (index === questions[currentQuestion].correct) {
            element.style.backgroundColor = '#5cb85c'; // Green for correct answer
            element.style.color = '#fff'; // White text color
        } else {
            element.style.backgroundColor = '#d9534f'; // Red for incorrect answers
            element.style.color = '#fff'; // White text color
        }
    });

    if (selected === questions[currentQuestion].correct) {
        resultElement.textContent = "Correct!";
        score++;
    } else {
        resultElement.textContent = "Wrong answer.";
    }
}

// Move to the next question
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
        document.getElementById('result').textContent = "";
    } else {
        showEndScreen();
    }
}

// Display the end screen with the score
function showEndScreen() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('score').textContent = `You scored ${score} out of ${questions.length}`;
}

// Restart the quiz
function restartQuiz() {
    score = 0;
    currentQuestion = 0;
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}

// Load questions and start the quiz when DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    document.getElementById('start-screen').style.display = 'block';
});
