document.addEventListener('DOMContentLoaded', function() {
  const buttonsContainer = document.getElementById('buttons');
  const exerciseNameDisplay = document.getElementById('exerciseName');
  const exerciseImageDisplay = document.getElementById('exerciseImage');
  const timerDisplay = document.getElementById('timer');
  const exerciseList = document.getElementById('exerciseList');
  const pauseBtn = document.getElementById('pauseBtn');
  const continueBtn = document.getElementById('continueBtn');
  const skipBtn = document.getElementById('skipBtn');
  const importSettingsBtn = document.getElementById('fileInput');
  let countdownInterval = null;
  let currentWorkout = null;
  let currentExerciseIndex = 0;
  const buttonColors = ['blue', 'red', 'orange', 'green', 'yellow'];
  let colorIndex = 0;

  fetch('workouts.json')
    .then(response => response.json())
    .then(data => {
      data.workouts.forEach(workout => {
        const button = document.createElement('button');
        button.textContent = workout.name;
        button.classList.add('text-white', 'px-4', 'py-2', 'rounded');
        button.style.backgroundColor = buttonColors[colorIndex];
        buttonsContainer.appendChild(button);
        colorIndex = (colorIndex + 1) % buttonColors.length;

        button.addEventListener('click', function() {
          startWorkout(workout);
        });
      });
    })
    .catch(error => console.error('Error loading workouts:', error));

  importSettingsBtn.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      try {
        const settings = JSON.parse(content);
        // Handle imported settings
        console.log('Imported Settings:', settings);
        // You can use the imported settings here
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    };
    reader.readAsText(file);
  });

  function startWorkout(workout) {
    clearInterval(countdownInterval); // Clear any existing timer

    currentWorkout = workout;
    currentExerciseIndex = 0;

    displayExerciseList();
    startNextExercise();
  }

  function startNextExercise() {
    if (currentExerciseIndex >= currentWorkout.exercises.length) {
      // Workout finished
      clearInterval(countdownInterval);
      timerDisplay.textContent = 'Workout Finished';
      playBeep(); // Play beep indicating workout finished
      return;
    }

    const exercise = currentWorkout.exercises[currentExerciseIndex];
    const timeLeft = parseInt(exercise.time);

    exerciseNameDisplay.textContent = exercise.name;
    exerciseImageDisplay.src = exercise.image_url;

    timerDisplay.textContent = timeLeft;

    countdownInterval = setInterval(function() {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        currentExerciseIndex++;
        displayExerciseList();
        startNextExercise();
      } else if (timeLeft <= 3) {
        playBeep(); // Play beep for last 3 seconds of exercise
      }
    }, 1000);
  }

  function displayExerciseList() {
    exerciseList.innerHTML = '';

    currentWorkout.exercises.forEach((exercise, index) => {
      const exerciseItem = document.createElement('div');
      exerciseItem.textContent = exercise.name;
      exerciseItem.classList.add('exercise-item');
      if (index === currentExerciseIndex) {
        exerciseItem.style.fontWeight = 'bold';
      }
      exerciseList.appendChild(exerciseItem);
    });
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
    displayExerciseList();
    startNextExercise();
  });

  function playBeep() {
    const audio = new Audio('beep.mp3');
    audio.play();
  }
});
