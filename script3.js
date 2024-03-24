document.addEventListener('DOMContentLoaded', function() {
  const exerciseImage = document.getElementById('exerciseImage');
  const timerDisplay = document.getElementById('timer');
  const buttonsContainer = document.getElementById('buttons');
  const pauseBtn = document.getElementById('pauseBtn');
  const skipBtn = document.getElementById('skipBtn');

  let currentWorkoutIndex = 0;
  let currentExerciseIndex = 0;
  let countdownInterval = null;
  let paused = false;

  fetch('http://127.0.0.1:5500/settings.json')
    .then(response => response.json())
    .then(data => {
      // Display initial exercise image
      displayExerciseImage(data.workouts[currentWorkoutIndex].exercises[currentExerciseIndex]);

      // Create buttons for workouts
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
    // Reset indexes and pause status
    currentExerciseIndex = 0;
    currentWorkoutIndex = 0;
    paused = false;

    // Start timer with the time of first exercise
    //startTimer(workout.exercises[currentExerciseIndex]);
    startWorkout(workout);
  }

  function startWorkout(workout) {
    workout.exercises.forEach(exercise => {
      startTimer(exercise);
    }
    )
  }

  function startTimer(exercise) {
    clearInterval(countdownInterval); // Clear existing timer

    let timeLeft = parseInt(exercise.time);
    timerDisplay.textContent = timeLeft;
    displayExerciseImage(exercise);

    countdownInterval = setInterval(function() {
      if (!paused) {
        console.log("index: "+currentExerciseIndex)
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          timerDisplay.textContent = 'Time\'s up!';
          
          if (currentExerciseIndex < workout.exercises.length - 1) {
            currentExerciseIndex++;
            startTimer(workout.exercises[currentExerciseIndex]); // Start timer for next exercise
          } else if (currentWorkoutIndex < data.workouts.length - 1) {
            currentWorkoutIndex++;
            currentExerciseIndex = 0;
            startTimer(data.workouts[currentWorkoutIndex].exercises[currentExerciseIndex]); // Start timer for next workout
          }
        }
      }
    }, 1000);
  }

  pauseBtn.addEventListener('click', function() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Continue' : 'Pause';
  });

  skipBtn.addEventListener('click', function() {
    clearInterval(countdownInterval);
    if (currentExerciseIndex < workout.exercises.length - 1) {
      currentExerciseIndex++;
      startTimer(workout.exercises[currentExerciseIndex]); // Start timer for next exercise
    } else if (currentWorkoutIndex < data.workouts.length - 1) {
      currentWorkoutIndex++;
      currentExerciseIndex = 0;
      startTimer(data.workouts[currentWorkoutIndex].exercises[currentExerciseIndex]); // Start timer for next workout
    }
  });

  function displayExerciseImage(exercise) {
    exerciseImage.innerHTML = `<img src="${exercise.image_url}" alt="${exercise.name}" />`;
  }
});