let coinCount = parseInt(localStorage.getItem('coinCount')) || 0; // Load total coins from local storage
const totalFarmingTime = 8 * 60 * 60; // 8 hours in seconds (28,800 seconds)
let countdownInterval; // Variable for countdown interval
let isFarming = false; // Farming state

const timeButton = document.getElementById("time-button");
const waterFill = document.getElementById("water-fill");
const coinCountDisplay = document.getElementById("coin-count");
const timeText = document.getElementById("time-text");

// Nickname modal-related elements
const nicknameModal = document.getElementById('nickname-modal');
const nicknameInput = document.getElementById('nickname-input');
const nicknameSubmit = document.getElementById('nickname-submit');
const userInfoElement = document.getElementById('user-info');

// Check if the user nickname is stored in localStorage
document.addEventListener("DOMContentLoaded", function () {
    let storedNickname = localStorage.getItem('nickname');

    if (storedNickname) {
        userInfoElement.innerText = `Hello, ${storedNickname}`; // Display the stored nickname
    } else {
        nicknameModal.style.display = 'flex'; // Show the modal if no nickname is stored
    }

    nicknameSubmit.addEventListener('click', function () {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            localStorage.setItem('nickname', nickname); // Save nickname to localStorage
            userInfoElement.innerText = `Hello, ${nickname}`; // Update the user info
            nicknameModal.style.display = 'none'; // Hide the modal
        } else {
            alert("Please enter a valid nickname");
        }
    });

    coinCountDisplay.innerText = coinCount; // Show total coin count

    checkFarmingProgress(); // Check if farming was ongoing
});

// Farming button logic
timeButton.addEventListener("click", function() {
    if (!isFarming && timeText.innerText === "Start Farming") {
        startFarming();
    } else if (timeText.innerText === "Claim Coins") {
        claimCoins();
    }
});

// Check farming progress and calculate remaining time
function checkFarmingProgress() {
    const farmingStartTime = localStorage.getItem('farmingStartTime');
    
    if (farmingStartTime) {
        const timePassed = Math.floor((Date.now() - parseInt(farmingStartTime)) / 1000); // Get time passed in seconds
        const remainingTime = totalFarmingTime - timePassed;

        if (remainingTime > 0) {
            resumeFarming(remainingTime);
        } else {
            timeText.innerText = "Claim Coins";
            timeText.style.color = "#ffcc00";
            timeButton.disabled = false;
        }
    }
}

// Start farming logic
function startFarming() {
    isFarming = true;
    timeButton.classList.add("filled");
    timeText.innerText = "Farming will be ended: 08:00:00";
    timeButton.disabled = true;

    localStorage.setItem('farmingStartTime', Date.now()); // Save the current time when farming starts

    waterFill.style.height = "100%"; // Start with full height
    waterFill.style.transition = "height 8h linear"; // 8-hour water fill

    let countdown = totalFarmingTime; // 28,800 seconds for 8 hours
    countdownInterval = setInterval(() => {
        countdown--;
        const hours = Math.floor(countdown / 3600);
        const minutes = Math.floor((countdown % 3600) / 60);
        const seconds = countdown % 60;
        timeText.innerText = `Farming will be ended: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            drainWater();
            timeText.innerText = "Claim Coins";
            timeText.style.color = "#ffcc00";
            timeButton.disabled = false;
            localStorage.removeItem('farmingStartTime');
        }
    }, 1000);
}

// Resume farming if page is reloaded
function resumeFarming(remainingTime) {
    isFarming = true;
    timeButton.classList.add("filled");
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    timeText.innerText = `Farming will be ended: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    timeButton.disabled = true;

    waterFill.style.height = "100%";
    waterFill.style.transition = `height ${remainingTime}s linear`; // Adjust water fill animation based on remaining time

    countdownInterval = setInterval(() => {
        remainingTime--;
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        timeText.innerText = `Farming will be ended: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            drainWater();
            timeText.innerText = "Claim Coins";
            timeText.style.color = "#ffcc00";
            timeButton.disabled = false;
            localStorage.removeItem('farmingStartTime');
        }
    }, 1000);
}

// Drain water logic
function drainWater() {
    waterFill.style.transition = "height 2s linear";
    waterFill.style.height = "0";
}

// Claim coins logic
function claimCoins() {
    if (timeText.innerText === "Claim Coins") {
        coinCount += 60; // Add 60 coins from farming
        coinCountDisplay.innerText = coinCount; // Update coin display
        localStorage.setItem('coinCount', coinCount); // Save total coins to local storage
        resetFarming();
    }
}

// Reset farming logic
function resetFarming() {
    isFarming = false;
    timeButton.classList.remove("filled");
    timeText.innerText = "Start Farming";
    timeText.style.color = "#ffffff";
    timeButton.disabled = false;
}
