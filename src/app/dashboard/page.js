"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });
  const [loading, setLoading] = useState(true);

  // 통계 데이터 로드 함수
  const loadStats = async () => {
    try {
      const { data, error } = await supabase.from("todos").select("*");

      if (error) throw error;

      setStats({
        total: data.length,
        active: data.filter((todo) => !todo.completed).length,
        completed: data.filter((todo) => todo.completed).length,
        highPriority: data.filter((todo) => todo.priority === "높음").length,
        mediumPriority: data.filter((todo) => todo.priority === "중간").length,
        lowPriority: data.filter((todo) => todo.priority === "낮음").length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        () => loadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-4 p-6">로딩 중...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-4 p-4">
        <h1 className="text-2xl font-bold mb-4 text-purple-600">ToDo 현황 대시보드</h1>
        
        <div className="space-y-4">
          {/* 전체 현황 */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-4 text-white">
            <h2 className="text-lg font-semibold mb-3">전체 현황</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-200 text-sm">전체 할일</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">완료율</p>
                <p className="text-2xl font-bold">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* 상태별 현황 */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg shadow-lg p-4 text-white">
            <h2 className="text-lg font-semibold mb-3">상태별 현황</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-200 text-sm">진행중</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">완료</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>

          {/* 우선순위별 현황 */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-lg p-4 text-white">
            <h2 className="text-lg font-semibold mb-3">우선순위별 현황</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-gray-200 text-sm">높음</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">중간</p>
                <p className="text-2xl font-bold">{stats.mediumPriority}</p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">낮음</p>
                <p className="text-2xl font-bold">{stats.lowPriority}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
