const question = document.getElementById('question');
const choices = document.getElementsByClassName('choice-text');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const gameArea = document.getElementById('gameArea');
const loader = document.getElementById('loader');
const correctBonus = 10;
const maxQuestions = 10;

let currentQuestion = {};
let canPlay = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];


/**Fetches Questions from an api */

    fetch(
        'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple'
    )
        .then((res) => {
            return res.json();
        })
        .then((loadedQuestions) => {
            questions = loadedQuestions.results.map((loadedQuestion) => {
                const formattedQuestion = {
                    question: loadedQuestion.question
                };
    
                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
                answerChoices.splice(
                    formattedQuestion.answer - 1,
                    0,
                    loadedQuestion.correct_answer
                );
    
                answerChoices.forEach((choice, index) => {
                    formattedQuestion['choice' + (index + 1)] = choice;
                });
    
                return formattedQuestion;
            });
            
            startGame();
        })
        .catch((err) => {
            console.error(err);
        });

    


/**
 * Starts New Game
 */

function startGame()  {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();

    /**Adds and hides loader */

    loader.classList.add('hide')
    gameArea.classList.remove('hide')
};

/**
 * Checks remaining questions and gets new question
 */

function getNewQuestion() {

    if (availableQuestions.length === 0 || questionCounter > maxQuestions) {
        localStorage.setItem('mostRecentScore', score);
        //go to the endgame page
        return window.location.assign('./endgame.html');
    }
   
    questionCounter++;
    progressText.innerHTML = `Question ${questionCounter}/${maxQuestions}`;
    //Update progress bar
    progressBarFull.style.width = `${(questionCounter / maxQuestions) * 100}%`;

    let questionIndex = Math.floor(Math.random()* availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    for(let choice of choices) {

        const number = choice.dataset['choice'];
        choice.innerText = currentQuestion['choice' + number];
    }

    availableQuestions.splice(questionIndex, 1);
    canPlay = true;
};

for (let choice of choices) {

    choice.addEventListener('click', e => {

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['choice'];
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (!canPlay) return;

        canPlay = false;
       
        if (classToApply === 'correct') {
            incrementScore(correctBonus);
            showAlert(true)
        } else {
            showAlert(false)
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {

            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
          }, 1000);
    });
};

/**Sweet alert for correct and incorrect answers*/

function showAlert(correct) {
    swal({

        position: 'center',
        icon: correct ? 'success' : 'error',
        title: correct ? 'You are Right!' : 'Sorry NOT the right answer',
        timer: 1000
    })
}

/**Increments Players Score*/

function incrementScore (num) {

    score += num;
    scoreText.innerText = score;

}

