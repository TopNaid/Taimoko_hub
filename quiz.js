document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.querySelector(".start-screen");
    const quizScreen = document.querySelector(".quiz");
    const endScreen = document.querySelector(".end-screen");
    const startBtn = document.querySelector(".start");
    const submitBtn = document.querySelector(".submit");
    const nextBtn = document.querySelector(".next");
    const restartBtn = document.querySelector(".restart");
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answer-wrapper");
    const progressBar = document.querySelector(".progress-bar");
    const progressText = document.querySelector(".progress-text");
    const currentQuestionNum = document.querySelector(".current");
    const totalQuestionsNum = document.querySelector(".total");
    const finalScore = document.querySelector(".final-score");
    const totalScore = document.querySelector(".total-score");
    const categorySelect = document.querySelector("#category");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft;
    let timer;
    let selectedCategory = "";

    categorySelect.addEventListener("change", (e) => {
        selectedCategory = e.target.value;
    });

    async function fetchQuestions() {
        const allQuestions = {
            "5": [
                { question: "What is 5 + 5?", answers: ["8", "9", "10", "11"], correct: 2 },
                { question: "What is 12 - 4?", answers: ["6", "8", "9", "10"], correct: 1 },
                { question: "What is 12 * 2?", answers: ["14", "8", "24", "10"], correct: 2 },
                { question: "What is 4 / 2?", answers: ["2", "8", "5", "10"], correct: 0 },
                { question: "What is the square of 4?", answers: ["6", "28", "16", "5"], correct: 2 },
                { question: "If 3x + 2 = 17, what is x?", answers: ["6", "5", "9", "4"], correct: 1 },
                { question: "A car travels 180 km in 3 hours. What is its average speed?", answers: ["60km/h", "80km/h", "90km/h", "50km/h"], correct: 0 },
                { question: "What is the square root of 144?", answers: ["6", "12", "9", "5"], correct: 1 },
                { question: "Solve for x: 2x + 5 = 15", answers: ["6", "8", "9", "5"], correct: 3 },
                { question: "If a triangle has angles of 40° and 60°, what is the measure of the third angle?", answers: ["60°", "70°", "80°", "50°"], correct: 2 }
            ],
            "10": [
                { question: "What is a noun?", answers: ["A place", "A verb", "An adjective", "A thing"], correct: 3 },
                { question: "Choose the correct spelling", answers: ["Recieve", "Receive", "Receeve", "Receeve"], correct: 1 },
                { question: "Which word is a noun?", answers: ["Run", "Happy", "Table", "Quickly"], correct: 2 },
                { question: "What is the plural of 'child'?", answers: ["Childs", "Childes", "Childies", "Children"], correct: 3 },
                { question: "Which sentence is correct?", answers: ["He go to school.", "He goes to school.", "He going to school.", "He goed to school."], correct: 1 },
                { question: "Which of the following sentences is grammatically correct?", answers: ["She doesn't like apples.", "She don't like apples.", "She not like apples.", "She isn't liking apples."], correct: 0 },
                { question: "What is the synonym of 'benevolent'?", answers: ["Angry", "Kind", "Greedy", "Careless"], correct: 1 },
                { question: "What is the antonym of 'fragile'?", answers: ["Weak", "Delicate", "Strong", "Breakable"], correct: 2 },
                { question: "What is the opposite of 'soft'?", answers: ["Hard", "Smooth", "Gentle", "Slow"], correct: 0 },
                { question: "What is the past tense of 'go'?", answers: ["Goes", "Gone", "Went", "Going"], correct: 2 },
            ],
            "15": [
                { question: "What does 'Sannu' mean in Hausa?", answers: ["Hello", "Goodbye", "Thank you", "Yes"], correct: 0 },
                { question: "Translate 'Ruwa'", answers: ["Fire", "Water", "Air", "Earth"], correct: 1 },
                { question: "What is 'Good morning' in Hausa?", answers: ["Ina kwana", "Sannu", "Yaya dai", "Barka da rana"], correct: 0 },
                { question: "What is the meaning of 'Ina jin yunwa'?", answers: ["I am sleepy", "I am angry", "I am hungry", "I am tired"], correct: 2 },
                { question: "Which one is a Hausa number?", answers: ["Eight", "Uku", "Dos", "EarthSept"], correct: 1 },
                { question: "Which of these is a correct Hausa proverb?", answers: ["Ruwan dare baya hana ruwa.", "Gida ruwan garin yafi ruwa.", "Mutum yana tafiya yana komowa.", "Hannu daya baya daukan kaya."], correct: 0 },
                { question: "What is the Hausa translation of 'She is my mother'?", answers: ["Ita ne abokina", "Ita ne yaya na", "Ita ce mata ta", "Ita ce mahaifiyata"], correct: 3 },
                { question: "What is the plural form of 'yarinya' (girl) in Hausa?", answers: ["Yaro", "Yarinya", "Yara", "Yarinyo"], correct: 2 },
                { question: "What is the meaning of the Hausa word 'ƙarfi'?", answers: ["Power/Strength", "Happiness", "Food", "Weakness"], correct: 0 },
                { question: "How do you say 'Thank you' in Hausa?", answers: ["Barka da safiya", "Nagode", "Gafara dai", "Yaya dai"], correct: 1 },
            ]
        };

        questions = selectedCategory && allQuestions[selectedCategory] ? allQuestions[selectedCategory] : Object.values(allQuestions).flat();
        totalQuestionsNum.textContent = `/${questions.length}`;
        loadQuestion();
    }

    function loadQuestion() {
        clearTimeout(timer);
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
            return;
        }
        
        const q = questions[currentQuestionIndex];
        questionText.textContent = q.question;
        answersWrapper.innerHTML = "";

        q.answers.forEach((answer, index) => {
            const answerDiv = document.createElement("div");
            answerDiv.classList.add("answer");
            answerDiv.innerHTML = `<span class='text'>${answer}</span><span class='checkbox'><span class='icon'>&#10004;</span></span>`;
            answerDiv.addEventListener("click", () => selectAnswer(answerDiv, index === q.correct));
            answersWrapper.appendChild(answerDiv);
        });

        submitBtn.disabled = true;
        currentQuestionNum.textContent = currentQuestionIndex + 1;
        startTimer(30);
    }

    function selectAnswer(answerDiv, isCorrect) {
        document.querySelectorAll(".answer").forEach(ans => ans.classList.remove("selected"));
        answerDiv.classList.add("selected");
        submitBtn.disabled = false;
        submitBtn.dataset.correct = isCorrect;
    }

    function startTimer(seconds) {
        timeLeft = seconds;
        progressText.textContent = timeLeft;
        progressBar.style.width = "100%";

        timer = setInterval(() => {
            timeLeft--;
            progressText.textContent = timeLeft;
            progressBar.style.width = `${(timeLeft / seconds) * 100}%`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitAnswer(false);
            }
        }, 1000);
    }

    function submitAnswer() {
        clearInterval(timer);
        const selectedAnswer = document.querySelector(".answer.selected");
        if (selectedAnswer) {
            const isCorrect = submitBtn.dataset.correct === "true";
            selectedAnswer.classList.add(isCorrect ? "correct" : "wrong");
            if (isCorrect) score++;
        }
        submitBtn.style.display = "none";
        nextBtn.style.display = "block";
    }

    function nextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
        submitBtn.style.display = "block";
        nextBtn.style.display = "none";
    }

    function endQuiz() {
        quizScreen.classList.add("hide");
        endScreen.classList.remove("hide");
        finalScore.textContent = score;
        totalScore.textContent = `/${questions.length}`;
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        startScreen.classList.remove("hide");
        quizScreen.classList.add("hide");
        endScreen.classList.add("hide");
    }

    startBtn.addEventListener("click", () => {
        startScreen.classList.add("hide");
        quizScreen.classList.remove("hide");
        fetchQuestions();
    });

    submitBtn.addEventListener("click", submitAnswer);
    nextBtn.addEventListener("click", nextQuestion);
    restartBtn.addEventListener("click", restartQuiz);
});
