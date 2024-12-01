"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  useEffect(() => {
    // 통계 업데이트 함수
    const updateStats = () => {
      try {
        const todos = JSON.parse(localStorage.getItem("todos") || "[]");
        
        setStats({
          total: todos.length,
          active: todos.filter(todo => !todo.completed).length,
          completed: todos.filter(todo => todo.completed).length,
          highPriority: todos.filter(todo => todo.priority === "높음").length,
          mediumPriority: todos.filter(todo => todo.priority === "중간").length,
          lowPriority: todos.filter(todo => todo.priority === "낮음").length,
        });
      } catch (error) {
        console.error("Error updating stats:", error);
      }
    };

    // 초기 통계 업데이트
    updateStats();

    // todoUpdate 이벤트 리스너 등록
    window.addEventListener('todoUpdate', updateStats);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('todoUpdate', updateStats);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-4 p-6">
        <h1 className="text-2xl font-bold mb-6">대시보드</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-600 rounded-lg p-4 text-white">
            <h2 className="text-lg font-semibold">전체 작업</h2>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-blue-600 rounded-lg p-4 text-white">
            <h2 className="text-lg font-semibold">진행중</h2>
            <p className="text-3xl font-bold">{stats.active}</p>
          </div>
          <div className="bg-green-600 rounded-lg p-4 text-white">
            <h2 className="text-lg font-semibold">완료</h2>
            <p className="text-3xl font-bold">{stats.completed}</p>
          </div>
          <div className="bg-indigo-600 rounded-lg p-4 text-white">
            <h2 className="text-lg font-semibold">완료율</h2>
            <p className="text-3xl font-bold">
              {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">우선순위 현황</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>높음</span>
              <span className="bg-red-500 px-2 py-1 rounded">{stats.highPriority}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>중간</span>
              <span className="bg-yellow-500 px-2 py-1 rounded text-black">{stats.mediumPriority}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>낮음</span>
              <span className="bg-blue-500 px-2 py-1 rounded">{stats.lowPriority}</span>
            </div>
          </div>
        </div>

        <Link 
          href="/" 
          className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          할 일 목록으로 돌아가기
        </Link>
      </div>
    </>
  );
} 