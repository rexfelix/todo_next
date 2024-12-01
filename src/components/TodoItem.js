export default function TodoItem({
  todo,
  toggleTodo,
  changePriority,
  deleteTodo,
  getPriorityStyle,
  isCompleted = false,
}) {
  const getPriorityClass = (priority) => {
    const baseClass = "ml-auto p-1 rounded ";
    switch (priority) {
      case "높음":
        return baseClass + "bg-red-500 text-white hover:bg-red-600";
      case "중간":
        return baseClass + "bg-green-500 text-black hover:bg-green-600";
      case "낮음":
        return baseClass + "bg-blue-500 text-white hover:bg-blue-600";
      default:
        return baseClass + "bg-gray-500 text-white";
    }
  };

  return (
    <li
      className={`flex items-center gap-2 p-2 border rounded ${
        isCompleted ? "bg-gray-900" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className={isCompleted ? "line-through text-gray-500" : ""}>
        {todo.text}
      </span>
      {!isCompleted && (
        <select
          value={todo.priority}
          onChange={(e) => changePriority(todo.id, e.target.value)}
          className={getPriorityClass(todo.priority)}
        >
          <option value="높음">높음</option>
          <option value="중간">중간</option>
          <option value="낮음">낮음</option>
        </select>
      )}
      {isCompleted && (
        <span className="text-gray-500 ml-auto">중요도: {todo.priority}</span>
      )}
      <button onClick={() => deleteTodo(todo.id)} className="text-red-500 ml-2">
        삭제
      </button>
    </li>
  );
}
