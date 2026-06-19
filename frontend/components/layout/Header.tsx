'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            🎯 tinyChanges
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.profilePictureUrl && (
                <Image
                  src={user.profilePictureUrl}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.isChild ? '👶 Child' : '👨‍👩‍👧 Parent'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
