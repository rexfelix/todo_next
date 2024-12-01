"use client";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { getPriorityStyle } from "@/utils/styles";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("중간");
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    loadTodos();
  }, []);

  // Supabase 실시간 구독 설정
  useEffect(() => {
    const channel = supabase
      .channel('todos')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'todos' },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 할일 목록 로드 함수
  const loadTodos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTodos(sortTodos(data || []));
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 업데이트 처리 함수
  const handleRealtimeUpdate = (payload) => {
    switch (payload.eventType) {
      case 'INSERT':
        setTodos(prev => sortTodos([payload.new, ...prev]));
        break;
      case 'UPDATE':
        setTodos(prev => sortTodos(
          prev.map(todo => todo.id === payload.new.id ? payload.new : todo)
        ));
        break;
      case 'DELETE':
        setTodos(prev => 
          prev.filter(todo => todo.id !== payload.old.id)
        );
        break;
    }
  };

  // Todo 추가 함수
  const addTodo = async () => {
    if (!input.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text: input,
          priority: priority,
          completed: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      setTodos(prev => [data, ...prev]);
      setInput('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Todo 삭제 함수
  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Todo 완료 상태 토글 함수
  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          completed: !todo.completed,
          completed_at: !todo.completed ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      // 로컬 상태 업데이트
      setTodos(prev => prev.map(t => 
        t.id === id 
          ? { ...t, 
              completed: !t.completed, 
              completed_at: !t.completed ? new Date().toISOString() : null 
            }
          : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // 우선순위 변경 함수
  const changePriority = async (id, newPriority) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ priority: newPriority })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      // 로컬 상태 업데이트 및 정렬
      setTodos(prev => {
        const updatedTodos = prev.map(todo => 
          todo.id === id ? { ...todo, priority: newPriority } : todo
        );
        // 우선순위와 생성일 기준으로 정렬
        return sortTodos(updatedTodos);
      });
    } catch (error) {
      console.error('Error changing priority:', error);
    }
  };

  // 할일 목록 정렬 함수
  const sortTodos = (todos, isCompleted = false) => {
    const priorityOrder = { "높음": 0, "중간": 1, "낮음": 2 };
    
    return [...todos].sort((a, b) => {
      if (isCompleted) {
        // 완료된 할일은 완료 시점 기준으로 정렬 (최신순)
        return new Date(b.completed_at) - new Date(a.completed_at);
      }
      
      // 미완료 할일은 우선순위와 생성일 기준으로 정렬
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  // 나머지 JSX 부분은 그대로 유지
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-4 p-6">
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <>
            <TodoForm
              priority={priority}
              setPriority={setPriority}
              input={input}
              setInput={setInput}
              addTodo={addTodo}
              getPriorityStyle={getPriorityStyle}
            />
            <TodoList
              title="진행중인 할일"
              todos={sortTodos(todos.filter(todo => !todo.completed), false)}
              toggleTodo={toggleTodo}
              changePriority={changePriority}
              deleteTodo={deleteTodo}
              getPriorityStyle={getPriorityStyle}
            />
            <TodoList
              title="완료된 할일"
              todos={sortTodos(todos.filter(todo => todo.completed), true)}
              toggleTodo={toggleTodo}
              changePriority={changePriority}
              deleteTodo={deleteTodo}
              getPriorityStyle={getPriorityStyle}
              isCompleted={true}
            />
          </>
        )}
      </div>
    </>
  );
}
