const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const gameBoard = document.getElementById("game-board");
const winMessage = document.getElementById("win-message");
const timerElement = document.getElementById("timer");

let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let countdown;
let timeLeft = 30;

const symbols = ["🍎","🍌","🍇","🍒","🍉","🍋","🍓","🥝"];
let cards = [...symbols, ...symbols]; // duplicate for pairs

// Shuffle function
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Start Game
startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  initGame();
});

// Restart Game
restartBtn.addEventListener("click", () => {
  initGame();
  winMessage.textContent = "";
});

// Initialize Game
function initGame() {
  gameBoard.innerHTML = "";
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  winMessage.textContent = "";
  timeLeft = 60;
  timerElement.textContent = timeLeft;

  clearInterval(countdown);
  startTimer();

  let shuffledCards = shuffle([...cards]);

  shuffledCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card, symbol));
    gameBoard.appendChild(card);
  });
}

function flipCard(card, symbol) {
  if (lockBoard) return;
  if (card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  let isMatch = firstCard.querySelector(".card-back").textContent ===
                secondCard.querySelector(".card-back").textContent;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchedPairs++;
  firstCard = null;
  secondCard = null;

  if (matchedPairs === symbols.length) {
    clearInterval(countdown);
    winMessage.style.color = "green";
    winMessage.textContent = "🎉 You Win! All pairs matched in time!";
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }, 1000);
}

// Timer Function
function startTimer() {
  countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      winMessage.style.color = "red";
      winMessage.textContent = "⏳ Time Out! You Lost!";
      lockBoard = true;
    }
  }, 1000);
}
