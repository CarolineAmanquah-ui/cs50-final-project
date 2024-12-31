import sqlite3
from flask import Flask

print("Connecting to database...")
# Connect to the SQLite database (it will be created if it doesn't exist)
conn = sqlite3.connect('todo.db')
print("Database connected.")

# Create a cursor object using the cursor method
cursor = conn.cursor()

print("Creating table...")
# Create table
cursor.execute('''
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0
)
''')
print("Table created.")

# Commit the changes
conn.commit()
print("Changes committed.")

# Close the database connection
conn.close()
print("Database and table created successfully.")
