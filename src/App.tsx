import { useEffect, useState } from 'react';
import type { Todo } from './types';
import './App.css';

const STORAGE_KEY = 'todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Todo[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
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

  return (
    <div className="app">
      <h1>TODO</h1>

      <div className="input-row">
        <input
          type="text"
          value={input}
          placeholder="할 일을 입력하세요"
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && addTodo()}
        />
        <button onClick={addTodo}>추가</button>
      </div>

      <ul className="todo-list">
        {todos.length === 0 && <li className="empty">할 일이 없습니다.</li>}
        {todos.map(todo => (
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
                <button className="edit-btn" onClick={() => startEdit(todo)}>수정</button>
                <button onClick={() => deleteTodo(todo.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
