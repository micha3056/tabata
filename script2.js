document.addEventListener('DOMContentLoaded', function() {
  const buttonsContainer = document.getElementById('buttons');
  const timerDisplay = document.getElementById('timer');

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
    let timeLeft = parseInt(workout.exercises[0].time); // Get time from the first exercise

    timerDisplay.textContent = timeLeft;

    const countdownInterval = setInterval(function() {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        timerDisplay.textContent = 'Time\'s up!';
      }
    }, 1000);
  }
});