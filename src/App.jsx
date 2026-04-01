import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addOrUpdateTodo = () => {
    if (task.trim() === "") return;

    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: task } : todo
        )
      );
      setEditId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: task,
        completed: false,
      };
      setTodos([...todos, newTodo]);
    }

    setTask("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (todo) => {
    setTask(todo.text);
    setEditId(todo.id);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addOrUpdateTodo();
    if (e.key === "Escape") {
      setTask("");
      setEditId(null);
    }
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Todo</h1>
        <p className="subtitle">what needs doing</p>
      </header>

      <div className="input-row">
        <input
          type="text"
          value={task}
          placeholder="Add a new task..."
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          className={`btn-add ${editId !== null ? "is-editing" : ""}`}
          onClick={addOrUpdateTodo}
        >
          {editId !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="todo-card">
        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <p>No tasks yet. Add one above.</p>
          </div>
        ) : (
          <>
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <div
                    className={`checkbox ${todo.completed ? "checked" : ""}`}
                    onClick={() => toggleComplete(todo.id)}
                  />
                  <span
                    className={`todo-text ${todo.completed ? "completed" : ""}`}
                    onClick={() => toggleComplete(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="btn-icon"
                      onClick={() => editTodo(todo)}
                    >
                      edit
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      del
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="todo-stats">
              <span>
                <span className="stats-dot" />
                {remaining} remaining
              </span>
              <span>{done} done</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;