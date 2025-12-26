import React, { useState } from "react";
import { TodoProps } from "../types/todo";

function Todo({
  id,
  name,
  completed,
  toggleTaskCompleted,
  deleteTask,
  editTask,
}: TodoProps) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newName.trim()) {
      editTask(id, newName);
      setEditing(false);
    }
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={`todo-${id}`}>
          New name for {name}
        </label>
        <input
          id={`todo-${id}`}
          className="todo-text"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={`todo-${id}`}
          type="checkbox"
          defaultChecked={completed}
          onChange={() => toggleTaskCompleted(id)}
        />
        <label className="todo-label" htmlFor={`todo-${id}`}>
          {name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => deleteTask(id)}
        >
          Delete <span className="visually-hidden">{name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
