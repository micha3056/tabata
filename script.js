document.addEventListener('DOMContentLoaded', function() {
  const buttonsContainer = document.getElementById('buttons');
  const timerDisplay = document.getElementById('timer');

  // Load settings from settings.json and create buttons dynamically
  // fetch('https://raw.githubusercontent.com/micha3056/tabata/main/settings3.json')
  fetch('http://127.0.0.1:5500/settings.json')
    .then(response => response.json())
    .then(settings => {
      settings.forEach(setting => {
        const button = document.createElement('button');
        button.textContent = setting.name;
        buttonsContainer.appendChild(button);

        button.addEventListener('click', function() {
          startCountdown(setting.totalTime);
          
        });
      });
    })
    .catch(error => console.error('Error loading settings:', error));

  function startCountdown(totalTime) {
    let timeLeft = totalTime;
    timerDisplay.textContent = timeLeft;

    const countdownInterval = setInterval(function() {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        timerDisplay.textContent = 'Time\'s up!';
        playSound('/beep.mp3');
      }
    }, 1000);
  }

  function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }


});