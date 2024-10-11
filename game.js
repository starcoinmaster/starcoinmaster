document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.querySelector('.game-container');
    const startButton = document.getElementById('startButton');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    let score = 0; 
    let timeLeft = 30; 
    let gameInterval;
    let coinVanishTimeout;

    // Function to place multiple coins and bombs randomly on the screen
    function placeObjects() {
        for (let i = 0; i < 5; i++) { 
            const coin = document.createElement('div');
            const isSmallCoin = Math.random() > 0.5;

            if (isSmallCoin) {
                coin.classList.add('coin', 'small-coin'); 
            } else {
                coin.classList.add('coin', 'big-coin'); 
            }

            const randomX = Math.floor(Math.random() * (gameContainer.offsetWidth - coin.offsetWidth));
            const randomY = Math.floor(Math.random() * (gameContainer.offsetHeight - coin.offsetHeight));

            coin.style.left = `${randomX}px`;
            coin.style.top = `${randomY}px`;

            gameContainer.appendChild(coin);

            coin.addEventListener('click', () => {
                if (coin.classList.contains('small-coin')) {
                    score += 1; 
                } else {
                    score += 5; 
                }
                scoreDisplay.textContent = score;
                gameContainer.removeChild(coin); 
            });

            // Coins disappear after 1 second
            coinVanishTimeout = setTimeout(() => {
                if (gameContainer.contains(coin)) {
                    gameContainer.removeChild(coin);
                }
            }, 1000);
        }

        // Place bombs
        for (let i = 0; i < 2; i++) { // Adding 2 bombs
            const bomb = document.createElement('div');
            bomb.classList.add('bomb');

            const randomX = Math.floor(Math.random() * (gameContainer.offsetWidth - bomb.offsetWidth));
            const randomY = Math.floor(Math.random() * (gameContainer.offsetHeight - bomb.offsetHeight));

            bomb.style.left = `${randomX}px`;
            bomb.style.top = `${randomY}px`;

            gameContainer.appendChild(bomb);

            bomb.addEventListener('click', () => {
                score = 0; // Reset score to zero
                scoreDisplay.textContent = score;
                
                // Simple bomb animation
                bomb.style.animation = 'bomb-click-animation 0.5s';
                
                setTimeout(() => {
                    gameContainer.removeChild(bomb);
                }, 500); // Remove bomb after animation
            });

            // Bombs disappear after 1 second
            setTimeout(() => {
                if (gameContainer.contains(bomb)) {
                    gameContainer.removeChild(bomb);
                }
            }, 1000);
        }
    }

    // Function to start the game
    function startGame() {
        score = 0;
        scoreDisplay.textContent = score;
        timeLeft = 30;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        startButton.style.display = 'none'; 

        const timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                clearInterval(gameInterval);
                clearTimeout(coinVanishTimeout);
                startButton.style.display = 'block'; 

                let totalCoins = parseInt(localStorage.getItem('coinCount')) || 0;
                totalCoins += score;
                localStorage.setItem('coinCount', totalCoins); 
            }
        }, 1000);

        gameInterval = setInterval(() => {
            placeObjects();
        }, 1000);
    }

    startButton.addEventListener('click', startGame);
});
