"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { getPriorityStyle } from "@/utils/styles";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("중간");

  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        priority: priority || "중간",
      };
      setTodos([...todos, newTodo]);
      setInput("");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const changePriority = (id, newPriority) => {
    console.log("Changing priority:", id, newPriority);
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  };

  const sortedActiveTodos = todos
    .filter((todo) => !todo.completed)
    .sort((a, b) => {
      const priorityOrder = { 높음: 0, 중간: 1, 낮음: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-4 p-6">
        <TodoForm
          priority={priority}
          setPriority={setPriority}
          input={input}
          setInput={setInput}
          addTodo={addTodo}
          getPriorityStyle={getPriorityStyle}
        />

        <TodoList
          title="진행중인 작업"
          todos={sortedActiveTodos}
          toggleTodo={toggleTodo}
          changePriority={changePriority}
          deleteTodo={deleteTodo}
          getPriorityStyle={getPriorityStyle}
        />

        <TodoList
          title="완료한 작업"
          todos={completedTodos}
          toggleTodo={toggleTodo}
          changePriority={changePriority}
          deleteTodo={deleteTodo}
          getPriorityStyle={getPriorityStyle}
          isCompleted={true}
        />
      </div>
    </>
  );
}
