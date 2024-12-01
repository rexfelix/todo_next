"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("중간");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const sortByPriority = (todos) => {
    const priorityOrder = { "높음": 0, "중간": 1, "낮음": 2 };
    return [...todos].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const sortByCompletedDate = (todos) => {
    return [...todos].sort((a, b) => {
      return new Date(b.completed_at) - new Date(a.completed_at);
    });
  };

  const addTodo = async () => {
    if (!input.trim()) return;

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            text: input,
            priority,
            user_id: user.id,
            completed: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => [data, ...prev]);
      setInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const completed_at = !todo.completed ? new Date().toISOString() : null;
      
      const { error } = await supabase
        .from("todos")
        .update({ 
          completed: !todo.completed,
          completed_at 
        })
        .eq("id", id);

      if (error) throw error;
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed, completed_at } : t
      ));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const changePriority = async (id, newPriority) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ priority: newPriority })
        .eq("id", id);

      if (error) throw error;
      setTodos(todos.map(t => 
        t.id === id ? { ...t, priority: newPriority } : t
      ));
    } catch (error) {
      console.error("Error changing priority:", error);
    }
  };

  const activeTodos = sortByPriority(todos.filter(todo => !todo.completed));
  const completedTodos = sortByCompletedDate(todos.filter(todo => todo.completed));

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-4 p-4">
        <TodoForm
          priority={priority}
          setPriority={setPriority}
          input={input}
          setInput={setInput}
          addTodo={addTodo}
        />
        <TodoList
          title="할 일 목록"
          todos={activeTodos}
          toggleTodo={toggleTodo}
          changePriority={changePriority}
          deleteTodo={deleteTodo}
        />
        <TodoList
          title="완료된 항목"
          todos={completedTodos}
          toggleTodo={toggleTodo}
          changePriority={changePriority}
          deleteTodo={deleteTodo}
          isCompleted={true}
        />
      </div>
    </>
  );
} 