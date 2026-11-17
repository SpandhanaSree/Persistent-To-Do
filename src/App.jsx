import { useReducer, useState, useEffect } from "react";
import "./App.css";

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, done: !todo.done }
          : todo
      );

    case "DELETE":
      return state.filter(
        (todo) => todo.id !== action.payload
      );

    case "EDIT":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );

    case "CLEAR_DONE":
  return state.filter((todo) => !todo.done);

    default:
      return state;
  }

}


function init() {
  try {
    const savedTodos = localStorage.getItem("todos");

    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}


function App() {
  const [filter, setFilter] = useState("All");
  const [todos, dispatch] = useReducer(todoReducer, [], init);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");

useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);


  function handleSubmit(e) {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: "ADD",
      payload: newTodo,
    });

    setInput("");
  }

  const filteredTodos = todos.filter((todo) => {
  if (filter === "Active") return !todo.done;
  if (filter === "Completed") return todo.done;

  return true;
});

return (
  <div className="app-container">
    <div className="todo-card">
      <header className="todo-header">
        <h1>My Tasks.</h1>
      </header>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add your new task..."
        />
        <button type="submit" className="add-btn">
          + Add
        </button>
      </form>

      <div className="todo-summary">
        <span>{todos.length} total tasks</span>
        <span>
          {todos.filter((todo) => !todo.done).length} remaining
        </span>
      </div>

      <div className="filter-tabs">
        {["All", "Active", "Completed"].map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "active-tab" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                dispatch({ type: "TOGGLE", payload: todo.id })
              }
            />

            {editingId === todo.id ? (
              <input
                className="edit-input"
                value={editText}
                autoFocus
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editText.trim()) {
                    dispatch({
                      type: "EDIT",
                      payload: {
                        id: todo.id,
                        text: editText.trim(),
                      },
                    });
                    setEditingId(null);
                  }

                  if (e.key === "Escape") {
                    setEditingId(null);
                  }
                }}
              />
            ) : (
              <span
                className={todo.done ? "completed-task" : ""}
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setEditText(todo.text);
                }}
              >
                {todo.text}
              </span>
            )}

            <button
              type="button"
              className="delete-btn"
              onClick={() =>
                dispatch({ type: "DELETE", payload: todo.id })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      
{filteredTodos.length === 0 && (
  <div className="empty-message">
    {filter === "All" && (
      <>
        <h3>No tasks here</h3>
        <p>Add a new task to get started!</p>
      </>
    )}

    {filter === "Active" && (
      <>
        <h3>No active tasks!</h3>
        <p>You're all caught up.</p>
      </>
    )}

    {filter === "Completed" && (
      <>
        <h3>No tasks yet completed!</h3>
        <p>Complete a task and it will appear here.</p>
      </>
    )}
  </div>
)}


      <div className="todo-footer">
        <span>
          {todos.filter((todo) => !todo.done).length} items left
        </span>

        <button
          type="button"
          className="clear-btn"
          onClick={() => dispatch({ type: "CLEAR_DONE" })}
        >
          Clear completed
        </button>
      </div>
    </div>
  </div>
);

}

export default App;
