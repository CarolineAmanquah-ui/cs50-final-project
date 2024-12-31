const tasksContainer = document.querySelector("#tasks");
const newTaskInput = document.querySelector("#wrapper input");
const countValue = document.querySelector(".count-value");

// Function to update task count
const displayCount = (count) => {
  console.log(`Updating count to: ${count}`);
  countValue.innerText = count;
};


// Fetch tasks and render them dynamically
const fetchTasks = async () => {
  const response = await fetch('/tasks'); // Fetch tasks from the backend
  const data = await response.json();

  // Clear only dynamically added tasks, keeping the #pending-tasks element
  const taskElements = tasksContainer.querySelectorAll(".task");
  taskElements.forEach((task) => task.remove());

  let incompleteCount = 0; // Initialize incomplete task count

  data.tasks.forEach((task) => {
    if (!task.completed) incompleteCount++; // Count incomplete tasks

    // Create HTML for each task
    const taskElement = `
    <div class="task" data-id="${task.id}">
        <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
        <span class="taskname ${task.completed ? "completed" : ""}">${task.description}</span>
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="far fa-trash-alt"></i></button>
    </div>`;
    tasksContainer.insertAdjacentHTML("beforeend", taskElement);
  });

  displayCount(incompleteCount); // Update the task count display
  attachEventListeners(); // Attach event listeners to dynamically loaded tasks
};


// Edit a task's description
const editTask = async (taskId, newDescription) => {
  const response = await fetch(`/edit/${taskId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: newDescription }),
  });

  if (response.ok) {
    fetchTasks(); // Refresh the tasks list to reflect the updated description
  } else {
    alert("Failed to edit task");
  }
};

// Attach event listeners for tasks
const attachEventListeners = () => {
  // Handle checkbox toggling for task completion
  const tasksCheck = document.querySelectorAll(".task-check");
  tasksCheck.forEach((checkbox) => {
    checkbox.onchange = (e) => {
      const taskId = e.target.closest(".task").dataset.id;
      toggleTask(checkbox, taskId); // Call toggleTask with checkbox and taskId
    };
  });

  // Handle task deletion
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.onclick = (e) => {
      const taskId = e.target.closest(".task").dataset.id;
      deleteTask(taskId); // Call deleteTask with taskId
    };
  });

  // Handle task editing
  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((button) => {
    button.onclick = (e) => {
      const taskId = e.target.closest(".task").dataset.id;
      const taskNameElement = e.target.closest(".task").querySelector(".taskname");

      // Prompt the user for a new task description
      const newDescription = prompt("Edit task description:", taskNameElement.textContent);
      if (newDescription) {
        editTask(taskId, newDescription.trim());
      }
    };
  });
};

// Toggle the completion status of a task
const toggleTask = async (checkbox, taskId) => {
  const response = await fetch(`/toggle/${taskId}`, {
    method: "POST", // Toggle the status in the backend
  });

  if (response.ok) {
    fetchTasks(); // Refresh the tasks list to reflect the updated status
  } else {
    alert("Failed to toggle task status");
  }
};

// Delete a task
const deleteTask = async (taskId) => {
  const response = await fetch(`/delete/${taskId}`, {
    method: "GET", // Delete the task in the backend
  });

  if (response.ok) {
    fetchTasks(); // Refresh the tasks list after deletion
  } else {
    alert("Failed to delete task");
  }
};

// Handle form submission to add a new task
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  const formData = new FormData(form);
  const response = await fetch("/add", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    fetchTasks(); // Refresh the tasks list after successful submission
    newTaskInput.value = ""; // Clear the input field
  } else {
    alert("Failed to add task");
  }
});

// Fetch tasks when the page loads
window.onload = () => {
  console.log("Page loaded and fetchTasks called");
  fetchTasks();
};

