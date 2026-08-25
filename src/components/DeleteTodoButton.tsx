interface DeleteTodoButtonProps {
  onDelete: () => void;
}

export default function DeleteTodoButton({ onDelete }: DeleteTodoButtonProps) {
  return <button onClick={onDelete}>삭제</button>;
}
