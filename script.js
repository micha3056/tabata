let countdownInterval = null; // Variable to store interval reference

document.addEventListener('DOMContentLoaded', function() {
  const buttonsContainer = document.getElementById('buttons');
  const timerDisplay = document.getElementById('timer');

  // Load settings from settings.json and create buttons dynamically
  // fetch('https://raw.githubusercontent.com/micha3056/tabata/main/settings3.json')
  fetch('http://127.0.0.1:5500/settings.json')
    .then(response => response.json())
    .then(data => {
      data.workouts.forEach(workout => {
        const button = document.createElement('button');
        button.textContent = workout.name;
        buttonsContainer.appendChild(button);

        button.addEventListener('click', function() {
          startWorkoutTimer(workout);
        });
      });
    })
    .catch(error => console.error('Error loading workouts:', error));

    function startWorkoutTimer(workout) {
      if (countdownInterval) { // Check if timer is already running
        clearInterval(countdownInterval); // Clear the previous timer
      }
  
      let timeLeft = parseInt(workout.exercises[0].time); // Get time from the first exercise
      timerDisplay.textContent = timeLeft;
  
      countdownInterval = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
  
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          timerDisplay.textContent = 'Time\'s up!';
          countdownInterval = null; // Reset the interval reference
          playSound('beep.mp3');
        }
      }, 1000);
    }



    function playSound(url) {
      const audio = new Audio(url);
      audio.play();
    }

    
  });


