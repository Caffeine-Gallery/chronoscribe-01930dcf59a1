import { backend } from "declarations/backend";

let currentTimerId = null;
let timerInterval = null;

async function getRandomPrompt() {
    showSpinner();
    try {
        const prompt = await backend.getRandomPrompt();
        document.getElementById('prompt').textContent = prompt;
    } catch (error) {
        console.error('Error getting prompt:', error);
    }
    hideSpinner();
}

async function startTimer() {
    showSpinner();
    try {
        currentTimerId = await backend.startTimer();
        document.getElementById('startTimer').disabled = true;
        document.getElementById('stopTimer').disabled = false;
        
        let timeLeft = 5 * 60; // 5 minutes in seconds
        updateTimerDisplay(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                stopTimer();
            }
        }, 1000);
    } catch (error) {
        console.error('Error starting timer:', error);
    }
    hideSpinner();
}

async function stopTimer() {
    if (currentTimerId !== null) {
        showSpinner();
        try {
            await backend.cancelTimer(currentTimerId);
            clearInterval(timerInterval);
            document.getElementById('startTimer').disabled = false;
            document.getElementById('stopTimer').disabled = true;
            document.getElementById('timer').textContent = '05:00';
            currentTimerId = null;
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
        hideSpinner();
    }
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    document.getElementById('timer').textContent = display;
}

async function saveWriting() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    
    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }

    showSpinner();
    try {
        await backend.saveWriting(title, content);
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        loadWritings();
    } catch (error) {
        console.error('Error saving writing:', error);
    }
    hideSpinner();
}

async function loadWritings() {
    showSpinner();
    try {
        const writings = await backend.getWritings();
        const writingsContainer = document.getElementById('previousWritings');
        writingsContainer.innerHTML = '';
        
        writings.forEach(([title, content]) => {
            const writingElement = document.createElement('div');
            writingElement.className = 'writing-entry';
            writingElement.innerHTML = `
                <h6>${title}</h6>
                <p>${content}</p>
                <hr>
            `;
            writingsContainer.appendChild(writingElement);
        });
    } catch (error) {
        console.error('Error loading writings:', error);
    }
    hideSpinner();
}

function showSpinner() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Event Listeners
document.getElementById('newPrompt').addEventListener('click', getRandomPrompt);
document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('stopTimer').addEventListener('click', stopTimer);
document.getElementById('saveWriting').addEventListener('click', saveWriting);

// Initial load
window.addEventListener('load', () => {
    getRandomPrompt();
    loadWritings();
});
