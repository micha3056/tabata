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
  const buttonColors = ['blue', 'red', 'orange', 'green', 'yellow'];
  let colorIndex = 0;

  fetch('http://127.0.0.1:5500/settings.json')
    .then(response => response.json())
    .then(data => {
      data.workouts.forEach(workout => {
        const button = document.createElement('button');
        button.classList.add('text-white', 'px-4', 'py-2', 'rounded', 'mr-4');
        
        button.style.backgroundColor = buttonColors[colorIndex];
        colorIndex = (colorIndex + 1) % buttonColors.length;

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
      playSound('success.mp3'); // Play beep indicating workout finished
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
        displayExerciseList();
      } else if (timeLeft <= 3) {
        playSound('beep.mp3');  // Play beep for last 3 seconds of exercise
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

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }

});