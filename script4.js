document.addEventListener('DOMContentLoaded', function() {
  const buttonsContainer = document.getElementById('buttons');
  const exerciseNameDisplay = document.getElementById('exerciseName');
  const exerciseImageDisplay = document.getElementById('exerciseImage');
  const timerDisplay = document.getElementById('timer');
  const pauseBtn = document.getElementById('pauseBtn');
  const continueBtn = document.getElementById('continueBtn');
  const skipBtn = document.getElementById('skipBtn');
  let countdownInterval = null;
  let currentWorkout = null;
  let currentExerciseIndex = 0;

  fetch('http://127.0.0.1:5500/settings.json')
    .then(response => response.json())
    .then(data => {
      data.workouts.forEach(workout => {
        const button = document.createElement('button');
        button.textContent = workout.name;
        buttonsContainer.appendChild(button);

        button.addEventListener('click', function() {
          startWorkout(workout);
        });
      });
    })
    .catch(error => console.error('Error loading workouts:', error));

  function startWorkout(workout) {
    clearInterval(countdownInterval); // Clear any existing timer

    currentWorkout = workout;
    currentExerciseIndex = 0;

    startNextExercise();
  }

  function startNextExercise() {
    if (currentExerciseIndex >= currentWorkout.exercises.length) {
      // Workout finished
      clearInterval(countdownInterval);
      timerDisplay.textContent = 'Workout Finished';
      return;
    }

    var exercise = currentWorkout.exercises[currentExerciseIndex];
    var timeLeft = parseInt(exercise.time);

    exerciseNameDisplay.textContent = exercise.name;
    exerciseImageDisplay.src = exercise.image_url;

    timerDisplay.textContent = timeLeft;

    countdownInterval = setInterval(function() {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        currentExerciseIndex++;
        startNextExercise();
      }
    }, 1000);
  }

  pauseBtn.addEventListener('click', function() {
    clearInterval(countdownInterval);
  });

  continueBtn.addEventListener('click', function() {
    startNextExercise();
  });

  skipBtn.addEventListener('click', function() {
    clearInterval(countdownInterval);
    currentExerciseIndex++;
    startNextExercise();
  });
});