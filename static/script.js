const addBtn = document.querySelector("#add-btn");
      const newTaskInput = document.querySelector("#wrapper input");
      const tasksContainer = document.querySelector("#tasks");
      const error = document.getElementById("error");
      const countValue = document.querySelector(".count-value");
      let taskCount = 0;
      const displayCount = (taskCount) => {
        countValue.innerText = taskCount;
      };
      const fetchTasks = async () => {
        const response = await fetch('/tasks');
        const data = await response.json();
        tasksContainer.innerHTML = ""; // Clear existing tasks
    
        data.tasks.forEach(task => {
            const taskElement = `
            <div class="task">
                <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
                <span class="taskname ${task.completed ? "completed" : ""}">${task.description}</span>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="delete"><i class="far fa-trash-alt"></i></button>
            </div>`;
            tasksContainer.insertAdjacentHTML("beforeend", taskElement);
        });
    };

        const deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach((button) => {
          button.onclick = () => {
            button.parentNode.remove();
            taskCount -= 1;
            displayCount(taskCount);
          };
        });
        const editButtons = document.querySelectorAll(".edit");
        editButtons.forEach((editBtn) => {
          editBtn.onclick = (e) => {
            let targetElement = e.target;
            if (!(e.target.className == "edit")) {
              targetElement = e.target.parentElement;
            }
            newTaskInput.value =
              targetElement.previousElementSibling?.innerText;
            targetElement.parentNode.remove();
            taskCount -= 1;
            displayCount(taskCount);
          };
        });
        const tasksCheck = document.querySelectorAll(".task-check");
        tasksCheck.forEach((checkBox) => {
          checkBox.onchange = () => {
            checkBox.nextElementSibling.classList.toggle("completed");
            if (checkBox.checked) {
              taskCount -= 1;
              console.log("checked");
            } else {
              taskCount += 1;
            }
            displayCount(taskCount);
          };
        });
        taskCount += 1;
        displayCount(taskCount);
        newTaskInput.value = "";

      window.onload = fetchTasks;

      const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(form);
    const response = await fetch('/add', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        fetchTasks(); // Reload tasks after successful submission
        newTaskInput.value = ""; // Clear input field
    } else {
        alert("Failed to add task");
    }
});

    