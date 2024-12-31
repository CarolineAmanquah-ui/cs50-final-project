from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
from flask_session import Session
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def get_db_connection():
    conn = sqlite3.connect('todo.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/set')
def set_session():
    session['key'] = 'value'
    return 'Session key set!'

@app.route('/get')
def get_session():
    if 'key' in session:
        return f'Session key is {session["key"]}'
    return 'No session key set'

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        description = request.form['description']
        if not description:
            return "Task description cannot be empty", 400

        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO tasks (description, completed) VALUES (?, ?)', (description, False))
            conn.commit()
        except sqlite3.DatabaseError as e:
            print(f"An error occurred: {e}")
            return "An error occurred", 500
        finally:
            conn.close()
        return redirect(url_for('index'))

    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM tasks').fetchall()
    conn.close()
    return render_template('index.html', tasks=tasks)


@app.route("/add", methods=['POST'])
def add():
    logging.info("Attempting to add a new task")
    description = request.form.get('description', None)
    if not description:
        logging.error("No description provided")
        return "Task description cannot be empty", 400

    logging.info(f"Received task description: {description}")
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO tasks (description, completed) VALUES (?, ?)', (description, False))
        conn.commit()
        logging.info(f"Task added successfully: {description}")
    except sqlite3.DatabaseError as e:
        logging.error(f"An error occurred while inserting into the database: {e}")
        return "An error occurred", 500
    finally:
        conn.close()
    return redirect(url_for('index'))


@app.route("/delete/<int:task_id>")
def delete(task_id):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
    except sqlite3.DatabaseError as e:
        print(f"An error occurred: {e}")
        return "An error occurred", 500
    finally:
        conn.close()
    return redirect(url_for('index'))

@app.route("/toggle/<int:task_id>", methods=["POST"])
def toggle(task_id):
    conn = get_db_connection()
    try:
        conn.execute('UPDATE tasks SET completed = NOT completed WHERE id = ?', (task_id,))
        conn.commit()
    except sqlite3.DatabaseError as e:
        logging.error(f"An error occurred: {e}")
        return "An error occurred", 500
    finally:
        conn.close()
    return '', 204  # Respond with no content


@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM tasks').fetchall()
    conn.close()
    return {"tasks": [dict(task) for task in tasks]}

@app.route("/edit/<int:task_id>", methods=["POST"])
def edit_task(task_id):
    new_description = request.json.get("description")
    if not new_description:
        return "Task description cannot be empty", 400

    conn = get_db_connection()
    try:
        conn.execute('UPDATE tasks SET description = ? WHERE id = ?', (new_description, task_id))
        conn.commit()
    except sqlite3.DatabaseError as e:
        logging.error(f"An error occurred: {e}")
        return "An error occurred", 500
    finally:
        conn.close()
    return '', 204

if __name__ == "__main__":
    app.run(debug=True)
