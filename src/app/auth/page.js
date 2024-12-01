"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleSignIn = async (skipPrompt = false) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            // access_type: 'offline',  // 리프레시 토큰이 필요한 경우 추가
            prompt: skipPrompt ? 'select_account' : 'consent'  // 계정 선택 화면 강제 표시
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-md px-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg rounded-lg p-6 mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">ToDo</h1>
          <p className="text-gray-100 mt-2">할 일 관리를 시작하세요</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">시작하기</h2>
            <p className="text-gray-300 mt-2">
              Google 계정으로 간편하게 로그인하세요
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleGoogleSignIn(false)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 
                       bg-gradient-to-r from-purple-600 to-indigo-600 
                       text-white rounded-lg
                       hover:from-purple-700 hover:to-indigo-700 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800
                       disabled:opacity-70 disabled:cursor-not-allowed
                       transition-all duration-200 ease-in-out"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span className="text-lg">
                {loading ? "로그인 중..." : "Google로 계속하기"}
              </span>
            </button>

            <button
              onClick={() => handleGoogleSignIn(true)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 
                       bg-gray-700 
                       text-white rounded-lg
                       hover:bg-gray-600
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800
                       disabled:opacity-70 disabled:cursor-not-allowed
                       transition-all duration-200 ease-in-out"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span className="text-lg">
                {loading ? "로그인 중..." : "다른 계정으로 로그인"}
              </span>
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 text-sm text-center text-red-400 bg-red-900 bg-opacity-50 rounded-lg">
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          안전한 Google 로그인으로 데이터를 안전하게 보호합니다
        </div>
      </div>
    </div>
  );
} 