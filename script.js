// Navigation entre les sections
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Retirer la classe active de tous les éléments de navigation
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Ajouter la classe active à l'élément cliqué
        this.classList.add('active');
        
        // Masquer toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Afficher la section cible
        const target = this.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    });
});

// Jeu de tri des déchets
const wasteItems = document.querySelectorAll('.waste-item');
const bins = document.querySelectorAll('.bin');
const gameFeedback = document.getElementById('game-feedback');
const resetButton = document.getElementById('reset-game');

let draggedItem = null;

// Événements de glisser-déposer
wasteItems.forEach(item => {
    item.addEventListener('dragstart', function() {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    });
    
    item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        draggedItem = null;
    });
});

bins.forEach(bin => {
    bin.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    bin.addEventListener('dragenter', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1.05)';
    });
    
    bin.addEventListener('dragleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    bin.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1)';
        
        if (draggedItem) {
            const wasteType = draggedItem.getAttribute('data-type');
            const binType = this.getAttribute('data-type');
            
            if (wasteType === binType) {
                gameFeedback.textContent = 'Bravo ! Tu as bien trié ce déchet.';
                gameFeedback.style.color = '#4CAF50';
                
                // Animation de succès
                draggedItem.style.transform = 'scale(0)';
                setTimeout(() => {
                    draggedItem.style.display = 'none';
                }, 300);
                
                // Créer des confettis
                createConfetti();
            } else {
                gameFeedback.textContent = 'Oops ! Ce n\'est pas la bonne poubelle. Essaie encore !';
                gameFeedback.style.color = '#F44336';
            }
        }
    });
});

// Réinitialiser le jeu
resetButton.addEventListener('click', function() {
    wasteItems.forEach(item => {
        item.style.display = 'flex';
        item.style.transform = 'scale(1)';
    });
    gameFeedback.textContent = '';
});

// Fonction pour créer des confettis
function createConfetti() {
    const colors = ['#4CAF50', '#FFC107', '#2196F3', '#F44336', '#9C27B0'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Quiz
const quizOptions = document.querySelectorAll('.quiz-option');
const nextButton = document.getElementById('next-question');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const questionElement = document.getElementById('question');

let score = 0;
let totalQuestions = 0;
let currentQuestion = 0;

const questions = [
    {
        question: "Dans quelle poubelle dois-tu jeter une bouteille en plastique ?",
        options: ["Poubelle jaune", "Poubelle bleue", "Poubelle verte", "Poubelle marron"],
        correct: 0
    },
    {
        question: "Où jettes-tu les journaux et magazines ?",
        options: ["Poubelle jaune", "Poubelle bleue", "Poubelle verte", "Poubelle marron"],
        correct: 1
    },
    {
        question: "Les épluchures de fruits vont dans quelle poubelle ?",
        options: ["Poubelle jaune", "Poubelle bleue", "Poubelle verte", "Poubelle marron"],
        correct: 3
    },
    {
        question: "Une bouteille en verre se jette dans :",
        options: ["Poubelle jaune", "Poubelle bleue", "Poubelle verte", "Poubelle marron"],
        correct: 2
    }
];

// Afficher la première question
showQuestion(0);

function showQuestion(index) {
    const question = questions[index];
    questionElement.textContent = question.question;
    
    quizOptions.forEach((option, i) => {
        option.textContent = question.options[i];
        option.dataset.correct = i === question.correct ? "true" : "false";
        option.classList.remove('correct', 'incorrect');
    });
    
    totalQuestions++;
    totalElement.textContent = totalQuestions;
}

quizOptions.forEach(option => {
    option.addEventListener('click', function() {
        if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
            return; // Ne pas permettre de répondre deux fois à la même question
        }
        
        const isCorrect = this.dataset.correct === "true";
        
        if (isCorrect) {
            this.classList.add('correct');
            score++;
            scoreElement.textContent = score;
            createConfetti();
        } else {
            this.classList.add('incorrect');
            // Afficher la bonne réponse
            quizOptions.forEach(opt => {
                if (opt.dataset.correct === "true") {
                    opt.classList.add('correct');
                }
            });
        }
    });
});

nextButton.addEventListener('click', function() {
    currentQuestion = (currentQuestion + 1) % questions.length;
    showQuestion(currentQuestion);
}); 
/* === SUPPORT TACTILE POUR MOBILE (AJOUT) === */

wasteItems.forEach(item => {
    item.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        item.classList.add('dragging');
        draggedItem = item;

        item.style.position = "absolute";
        item.style.zIndex = "1000";

        item.style.left = touch.clientX - item.offsetWidth / 2 + "px";
        item.style.top = touch.clientY - item.offsetHeight / 2 + "px";
    });

    item.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        item.style.left = touch.clientX - item.offsetWidth / 2 + "px";
        item.style.top = touch.clientY - item.offsetHeight / 2 + "px";
    });

    item.addEventListener('touchend', (e) => {
        item.classList.remove('dragging');

        const touch = e.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;

        let dropped = false;

        bins.forEach(bin => {
            const rect = bin.getBoundingClientRect();

            if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {

                const wasteType = item.dataset.type;
                const binType = bin.dataset.type;

                if (wasteType === binType) {
                    gameFeedback.textContent = "Bravo ! Tu as bien trié ce déchet.";
                    gameFeedback.style.color = "#4CAF50";
                    createConfetti();
                    item.style.display = "none";
                } else {
                    gameFeedback.textContent = "Oops ! Ce n'est pas la bonne poubelle.";
                    gameFeedback.style.color = "#F44336";
                }

                dropped = true;
            }
        });

        if (!dropped) {
            // Retour à la position normale
            item.style.position = "";
            item.style.left = "";
            item.style.top = "";
            item.style.zIndex = "";
        }

        draggedItem = null;
    });
});
