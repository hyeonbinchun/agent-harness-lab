import { useEffect, useState } from 'react';
import type { Priority, Todo } from './types';
import { PRIORITY_LABEL } from './types';
import DeleteTodoButton from './components/DeleteTodoButton';
import AddTodoForm from './components/AddTodoForm';
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

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

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const confirmEdit = (id: number) => {
    const text = editText.trim();
    if (text) {
      setTodos(todos.map(t => t.id === id ? { ...t, text } : t));
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
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
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {editingId === todo.id ? (
              <>
                <input
                  className="edit-input"
                  value={editText}
                  autoFocus
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) confirmEdit(todo.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  onBlur={cancelEdit}
                />
                <button onClick={cancelEdit}>취소</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                <select
                  className="priority-select"
                  aria-label={`${todo.text} 우선순위`}
                  value={todo.priority}
                  onChange={e => changePriority(todo.id, e.target.value as Priority)}
                >
                  <option value="high">{PRIORITY_LABEL.high}</option>
                  <option value="medium">{PRIORITY_LABEL.medium}</option>
                  <option value="low">{PRIORITY_LABEL.low}</option>
                </select>
                <input
                  type="date"
                  className="due-date-input"
                  aria-label={`${todo.text} 마감일`}
                  value={todo.dueDate ?? ''}
                  onChange={e => changeDueDate(todo.id, e.target.value)}
                />
                <button className="edit-btn" onClick={() => startEdit(todo)}>수정</button>
                <DeleteTodoButton onDelete={() => deleteTodo(todo.id)} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
