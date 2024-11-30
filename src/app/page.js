"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("중간");

  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input,
          completed: false,
          priority: priority,
        },
      ]);
      setInput("");
      setPriority("중간");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? Date.now() : null,
            }
          : todo
      )
    );
  };

  const changePriority = (id, newPriority) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  };

  const priorityWeight = {
    높음: 3,
    중간: 2,
    낮음: 1,
  };

  const sortedActiveTodos = todos
    .filter((todo) => !todo.completed)
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  const completedTodos = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => b.completedAt - a.completedAt);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "높음":
        return "bg-red-500 text-white";
      case "중간":
        return "bg-yellow-500 text-black";
      case "낮음":
        return "bg-blue-500 text-white";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg rounded-lg">
            <div className="px-4">
              <div className="flex items-center justify-between h-16">
                <div className="text-white font-bold text-xl">
                  ToDo
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/" className="text-gray-100 hover:text-white px-3 py-2 rounded-md hover:bg-purple-500 transition-colors">
                    홈
                  </Link>
                  <Link href="/dashboard" className="text-gray-100 hover:text-white px-3 py-2 rounded-md hover:bg-purple-500 transition-colors">
                    대시보드
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
   
    <div className="max-w-md mx-auto mt-4 p-6">
      {/* <h1 className="text-2xl font-bold mb-4">할 일 목록</h1> */}

      <div className="flex gap-2 mb-4">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={`p-2 border rounded ${getPriorityStyle(priority)}`}
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

      {/* 진행중인 할 일 목록 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">진행중인 작업</h2>
        <ul className="space-y-2">
          {sortedActiveTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <select
                value={todo.priority}
                onChange={(e) => changePriority(todo.id, e.target.value)}
                className={`ml-auto p-1 rounded ${getPriorityStyle(todo.priority)}`}
              >
                <option value="높음">높음</option>
                <option value="중간">중간</option>
                <option value="낮음">낮음</option>
              </select>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 ml-2"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 완료된 할 일 목록 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">완료한 작업</h2>
        <ul className="space-y-2">
          {completedTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-2 p-2 border rounded bg-gray-900"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="line-through text-gray-500">{todo.text}</span>
              <span className="text-gray-500 ml-auto">
                중요도: {todo.priority}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 ml-2"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </>
  );
}
