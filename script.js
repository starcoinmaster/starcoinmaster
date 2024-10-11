let coinCount = parseInt(localStorage.getItem('coinCount')) || 0; // Load total coins from local storage
let isFarming = false; // Farming state
let countdownInterval; // Variable for countdown interval

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
        // Show the modal if no nickname is stored
        nicknameModal.style.display = 'flex';
    }

    // When the user clicks submit, save the nickname
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

    // Update coin count display with the total coins
    coinCountDisplay.innerText = coinCount; // Show total coin count

    // Check if farming was ongoing before reload
    checkFarmingProgress();
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
    const farmingDuration = 30; // Duration for farming

    if (farmingStartTime) {
        const timePassed = Math.floor((Date.now() - parseInt(farmingStartTime)) / 1000);
        const remainingTime = farmingDuration - timePassed;

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
    timeText.innerText = "Farming will be ended: 00:30";
    timeButton.disabled = true;

    localStorage.setItem('farmingStartTime', Date.now()); // Save the current time when farming starts

    waterFill.style.height = "100%"; // Start with full height
    waterFill.style.transition = "height 30s linear"; // Full farming time

    let countdown = 30; // 30 seconds for farming
    countdownInterval = setInterval(() => {
        countdown--;
        timeText.innerText = `Farming will be ended: 00:${countdown < 10 ? "0" : ""}${countdown}`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            drainWater(); // Call to drain water
            timeText.innerText = "Claim Coins";
            timeText.style.color = "#ffcc00";
            timeButton.disabled = false;
            localStorage.removeItem('farmingStartTime'); // Remove farming start time when done
        }
    }, 1000);
}

// Resume farming if page is reloaded during farming
function resumeFarming(remainingTime) {
    isFarming = true;
    timeButton.classList.add("filled");
    timeText.innerText = `Farming will be ended: 00:${remainingTime < 10 ? "0" : ""}${remainingTime}`;
    timeButton.disabled = true;

    waterFill.style.height = "100%";
    waterFill.style.transition = `height ${remainingTime}s linear`;

    countdownInterval = setInterval(() => {
        remainingTime--;
        timeText.innerText = `Farming will be ended: 00:${remainingTime < 10 ? "0" : ""}${remainingTime}`;
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            drainWater(); 
            timeText.innerText = "Claim Coins";
            timeText.style.color = "#ffcc00";
            timeButton.disabled = false;
            localStorage.removeItem('farmingStartTime'); // Clear stored farming start time
        }
    }, 1000);
}

function drainWater() {
    waterFill.style.transition = "height 2s linear";
    waterFill.style.height = "0"; 
}

function claimCoins() {
    if (timeText.innerText === "Claim Coins") {
        coinCount += 60; // Add 60 coins from farming
        coinCountDisplay.innerText = coinCount; // Update coin display
        localStorage.setItem('coinCount', coinCount); // Save total coins to local storage
        resetFarming();
    }
}

function resetFarming() {
    isFarming = false;
    timeButton.classList.remove("filled");
    timeText.innerText = "Start Farming";
    timeText.style.color = "#ffffff";
    timeButton.disabled = false;
}
