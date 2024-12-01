export default function TodoForm({
  priority,
  setPriority,
  input,
  setInput,
  addTodo,
  getPriorityStyle,
}) {
  const getPriorityClass = (priority) => {
    const baseClass = "p-2 border rounded ";
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
    <div className="flex gap-2 mb-4">
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={getPriorityClass(priority)}
      >
        <option value="높음">높음</option>
        <option value="중간">중간</option>
        <option value="낮음">낮음</option>
      </select>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
        className="flex-1 p-2 border rounded text-black"
        placeholder="할 일을 입력하세요"
      />
      <button
        onClick={addTodo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        추가
      </button>
    </div>
  );
}
