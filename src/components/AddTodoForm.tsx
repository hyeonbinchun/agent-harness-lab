import { useState } from 'react';
import type { Priority } from '../types';
import { PRIORITY_LABEL } from '../types';

interface AddTodoFormProps {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    onAdd(text, priority, dueDate || undefined);
    setInput('');
    setDueDate('');
  };

  return (
    <div className="input-row">
      <input
        type="text"
        value={input}
        placeholder="할 일을 입력하세요"
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAdd()}
      />
      <select
        className="priority-select"
        aria-label="우선순위"
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
      >
        <option value="high">{PRIORITY_LABEL.high}</option>
        <option value="medium">{PRIORITY_LABEL.medium}</option>
        <option value="low">{PRIORITY_LABEL.low}</option>
      </select>
      <input
        type="date"
        className="due-date-input"
        aria-label="마감일"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      <button onClick={handleAdd}>추가</button>
    </div>
  );
}
