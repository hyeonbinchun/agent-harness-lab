import { useState } from 'react';
import type { Priority, Todo } from '../types';
import { PRIORITY_LABEL } from '../types';
import DeleteTodoButton from './DeleteTodoButton';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onChangePriority: (id: number, priority: Priority) => void;
  onChangeDueDate: (id: number, dueDate: string) => void;
  onEditSave: (id: number, text: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onChangePriority,
  onChangeDueDate,
  onEditSave,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const startEdit = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  const confirmEdit = () => {
    const text = editText.trim();
    if (text) onEditSave(todo.id, text);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <li className={todo.completed ? 'completed' : ''}>
      {isEditing ? (
        <>
          <input
            className="edit-input"
            value={editText}
            autoFocus
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) confirmEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            onBlur={cancelEdit}
          />
          <button onClick={cancelEdit}>취소</button>
        </>
      ) : (
        <>
          <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
          <select
            className="priority-select"
            aria-label={`${todo.text} 우선순위`}
            value={todo.priority}
            onChange={e => onChangePriority(todo.id, e.target.value as Priority)}
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
            onChange={e => onChangeDueDate(todo.id, e.target.value)}
          />
          <button className="edit-btn" onClick={startEdit}>수정</button>
          <DeleteTodoButton onDelete={() => onDelete(todo.id)} />
        </>
      )}
    </li>
  );
}
