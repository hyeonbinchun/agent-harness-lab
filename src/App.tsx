import { useEffect, useState } from 'react';
import type { Priority, Todo } from './types';
import AddTodoForm from './components/AddTodoForm';
import TodoItem from './components/TodoItem';
import './App.css';

const STORAGE_KEY = 'todos';
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Todo[]) : [];
      return parsed.map(t => ({ ...t, priority: t.priority ?? 'medium' }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority, dueDate?: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false, priority, dueDate }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const changePriority = (id: number, newPriority: Priority) => {
    setTodos(todos.map(t => t.id === id ? { ...t, priority: newPriority } : t));
  };

  const changeDueDate = (id: number, newDueDate: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, dueDate: newDueDate || undefined } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const editTodoText = (id: number, text: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text } : t));
  };

  const sortedTodos = [...todos].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="app">
      <h1>TODO</h1>

      <AddTodoForm onAdd={addTodo} />

      <ul className="todo-list">
        {sortedTodos.length === 0 && <li className="empty">아직 할 일이 없어요.</li>}
        {sortedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onChangePriority={changePriority}
            onChangeDueDate={changeDueDate}
            onEditSave={editTodoText}
          />
        ))}
      </ul>
    </div>
  );
}
