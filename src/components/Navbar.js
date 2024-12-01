import Link from 'next/link';

export default function Navbar() {
  return (
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
  );
} 