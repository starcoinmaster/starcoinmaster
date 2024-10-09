document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.querySelector('.game-container');
    const startButton = document.getElementById('startButton');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    let score = 0; // Reset game score to 0 at start
    let timeLeft = 30; // Time reduced to 30 seconds
    let gameInterval;
    let coinVanishTimeout;

    // Function to place multiple coins randomly on the screen
    function placeCoins() {
        for (let i = 0; i < 5; i++) { // Place 5 coins
            const coin = document.createElement('div');
            const isSmallCoin = Math.random() > 0.5;

            if (isSmallCoin) {
                coin.classList.add('coin', 'small-coin'); // Small coin
            } else {
                coin.classList.add('coin', 'big-coin'); // Big coin
            }

            const randomX = Math.floor(Math.random() * (gameContainer.offsetWidth - coin.offsetWidth));
            const randomY = Math.floor(Math.random() * (gameContainer.offsetHeight - coin.offsetHeight));

            coin.style.left = `${randomX}px`;
            coin.style.top = `${randomY}px`;

            gameContainer.appendChild(coin);

            coin.addEventListener('click', () => {
                if (coin.classList.contains('small-coin')) {
                    score += 1; // Small coin gives 1 point
                } else {
                    score += 5; // Big coin gives 5 points
                }
                scoreDisplay.textContent = score;
                gameContainer.removeChild(coin); // Remove coin when clicked
            });

            // Make coins disappear after 1 second if not clicked
            coinVanishTimeout = setTimeout(() => {
                if (gameContainer.contains(coin)) {
                    gameContainer.removeChild(coin);
                }
            }, 1000);
        }
    }

    // Function to start the game
    function startGame() {
        score = 0;
        scoreDisplay.textContent = score;
        timeLeft = 30; // Set time to 30 seconds
        timerDisplay.textContent = `Time: ${timeLeft}`;
        startButton.style.display = 'none'; // Hide the start button

        const timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                clearInterval(gameInterval);
                clearTimeout(coinVanishTimeout);
                startButton.style.display = 'block'; // Show the start button again

                // Add the score to the user's total coin count in localStorage
                let totalCoins = parseInt(localStorage.getItem('coinCount')) || 0;
                totalCoins += score; // Add game score to total coins
                localStorage.setItem('coinCount', totalCoins); // Update local storage
            }
        }, 1000);

        gameInterval = setInterval(() => {
            placeCoins();
        }, 1000);
    }

    startButton.addEventListener('click', startGame);
});
