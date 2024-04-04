let exercises = [];
let selectedIndex = -1;

function toggleAddExercise() {
  const exerciseDetailsDiv = document.getElementById("exerciseDetails");
  exerciseDetailsDiv.style.display = exerciseDetailsDiv.style.display === "none" ? "block" : "none";
}

function addOrUpdateExercise() {
  const title = document.getElementById("exerciseTitle").value;
  const time = document.getElementById("exerciseTime").value;
  const imageUrl = document.getElementById("exerciseImageUrl").value;
  
  if (title && time) {
    if (selectedIndex !== -1) {
      exercises[selectedIndex] = { title, time, imageUrl };
    } else {
      exercises.push({ title, time, imageUrl });
    }
    renderExercises();
    selectedIndex = -1;
    clearEdit();
    toggleAddExercise();
  } else {
    alert("Please enter title and time.");
  }
}

function deleteExercise(index) {
  exercises.splice(index, 1);
  renderExercises();
}

function selectExercise(index) {
  selectedIndex = index;
  const selectedExercise = exercises[index];
  document.getElementById("exerciseTitle").value = selectedExercise.title;
  document.getElementById("exerciseTime").value = selectedExercise.time;
  document.getElementById("exerciseImageUrl").value = selectedExercise.imageUrl;
}

function cancelEdit() {
  selectedIndex = -1;
  clearEdit();
  toggleAddExercise();
}

function clearEdit() {
  document.getElementById("exerciseTitle").value = "";
  document.getElementById("exerciseTime").value = "";
  document.getElementById("exerciseImageUrl").value = "";
}

function renderExercises() {
  const exercisesListDiv = document.getElementById("exercisesList");
  exercisesListDiv.innerHTML = "";
  exercises.forEach((exercise, index) => {
    const exerciseDiv = document.createElement("div");
    exerciseDiv.innerHTML = `<strong>Title:</strong> ${exercise.title}, <strong>Time:</strong> ${exercise.time} 
                             <button class="btn btn-info btn-sm mr-2" onclick="selectExercise(${index})">Edit</button>
                             <button class="btn btn-danger btn-sm" onclick="deleteExercise(${index})">Delete</button>
                             <button class="btn btn-outline-secondary btn-sm ml-2" onclick="moveUp(${index})">Up</button>
                             <button class="btn btn-outline-secondary btn-sm" onclick="moveDown(${index})">Down</button>`;
    exercisesListDiv.appendChild(exerciseDiv);
  });
}

function moveUp(index) {
  if (index > 0) {
    const temp = exercises[index];
    exercises[index] = exercises[index - 1];
    exercises[index - 1] = temp;
    renderExercises();
  }
}

function moveDown(index) {
  if (index < exercises.length - 1) {
    const temp = exercises[index];
    exercises[index] = exercises[index + 1];
    exercises[index + 1] = temp;
    renderExercises();
  }
}

function exportJson() {
  const data = JSON.stringify({
    workouts: exercises.map(workout => ({
      name: workout.title,
      exercises: [{
        name: workout.title,
        time: workout.time,
        image_url: workout.imageUrl
      }]
    }))
  }, null, 2); // Using null as the second parameter to maintain the default behavior, and 2 for indentation.
  
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workouts.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importJson() {
  const file = document.getElementById("fileInput").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const importedData = JSON.parse(event.target.result);
      if (importedData.workouts) {
        exercises = importedData.workouts.flatMap(workout => workout.exercises.map(exercise => ({
          title: exercise.name,
          time: exercise.time,
          imageUrl: exercise.image_url
        })));
        renderExercises();
        alert("JSON imported successfully.");
      } else {
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  }
}


// function exportJson() {
  // const data = JSON.stringify(exercises);
  // const blob = new Blob([data], { type: "application/json" });
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "exercises.json";
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // URL.revokeObjectURL(url);
// }

// function importJson() {
  // const file = document.getElementById("fileInput").files[0];
  // if (file) {
    // const reader = new FileReader();
    // reader.onload = function(event) {
      // const importedData = JSON.parse(event.target.result);
      // exercises = importedData;
      // renderExercises();
      // alert("JSON imported successfully.");
    // };
    // reader.readAsText(file);
  // }
// }

function clearExercises() {
  exercises = [];
  renderExercises();
}
