"use client";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
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
      const { data, error } = await supabase
        .from('todos')
        .select('*');
      
      if (error) throw error;

      // 통계 계산
      setStats({
        total: data.length,
        active: data.filter(todo => !todo.completed).length,
        completed: data.filter(todo => todo.completed).length,
        highPriority: data.filter(todo => todo.priority === "높음").length,
        mediumPriority: data.filter(todo => todo.priority === "중간").length,
        lowPriority: data.filter(todo => todo.priority === "낮음").length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadStats();
  }, []);

  // Supabase 실시간 구독 설정
  useEffect(() => {
    const channel = supabase
      .channel('todos')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'todos' },
        () => {
          // 변경사항이 있을 때마다 통계 다시 로드
          loadStats();
        }
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
        <div className="max-w-md mx-auto mt-4 p-6">
          로딩 중...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-4 p-6">
        <h1 className="text-2xl font-bold mb-6">대시보드</h1>
        
        {/* 전체 통계 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">전체 현황</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400">전체 할일</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">완료율</p>
              <p className="text-2xl font-bold">
                {stats.total > 0 
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* 상태별 통계 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">상태별 현황</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400">진행중</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">완료</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* 우선순위별 통계 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">우선순위별 현황</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-red-600">높음</p>
              <p className="text-2xl font-bold">{stats.highPriority}</p>
            </div>
            <div>
              <p className="text-yellow-600">중간</p>
              <p className="text-2xl font-bold">{stats.mediumPriority}</p>
            </div>
            <div>
              <p className="text-blue-600">낮음</p>
              <p className="text-2xl font-bold">{stats.lowPriority}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
