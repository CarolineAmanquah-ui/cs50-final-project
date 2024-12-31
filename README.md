# To-Do List Application

#### Video Demo: [Click here to watch](https://drive.google.com/file/d/1SyBOx7hCvJVsuNP3WKTewr41Mk7ZxiqT/view?usp=sharing)

---

## **Description**

The To-Do List Application is a simple yet powerful web-based task management tool. It allows users to efficiently organise their tasks by enabling them to:

- Add new tasks to the list.
- Edit existing tasks to reflect changes.
- Mark tasks as completed by checking them off.
- Delete tasks once they are no longer needed.

The application stores all tasks in an SQLite database, ensuring data persistence. It dynamically updates the task list in real-time, providing a seamless and user-friendly experience.

---

## **Project Details**

- **Title**: To-Do List Application
- **Author**: Caroline Amanquah
- **GitHub Username**: CarolineAmanquah-ui
- **edX Username**: carolineamanquah
- **Location**: London, UK
- **Recording Date**: 31/12/2024

---

## **Technical Features**

1. **Adding Tasks**:
   - Users can type a new task into the input field and click "Add".
   - The task is immediately displayed in the list and stored in the SQLite database.

2. **Editing Tasks**:
   - Tasks can be modified using the "Edit" button, which prompts users to update the description.

3. **Marking Tasks as Completed**:
   - Checking a task marks it as completed, applying a visual strikethrough and updating its status in the database.

4. **Deleting Tasks**:
   - Tasks can be permanently removed using the "Delete" button.

5. **Dynamic Updates**:
   - The application dynamically synchronises the task list with the database without requiring a page refresh.

6. **Database Management**:
   - Tasks are stored in an SQLite database.
   - Users can view task details directly using SQL commands:
     - `SELECT * FROM tasks;` to view all tasks.
     - `SELECT id, description, CASE WHEN completed = 0 THEN 'No' ELSE 'Yes' END as completed FROM tasks;` for a descriptive output.

---

## **Technologies Used**

- **Frontend**: HTML, CSS, JavaScript (with FontAwesome icons for UI enhancements)
- **Backend**: Python (Flask framework)
- **Database**: SQLite
- **Version Control**: Git and GitHub

---

## **How to Run**

1. Clone the repository:

```bash
   git clone <repository_url>

```

2. Navigate to the project directory:

```bash
    cd CS50_Final_Project

```

3. Create and activate a virtual environment:

```bash
    python3 -m venv venv
    source venv/bin/activate

```

4. Install dependencies: 

```bash
pip install -r requirements.txt

```

5. Run the application:

```bash
flask run

```

6. Access the application at: http://127.0.0.1:5000/
