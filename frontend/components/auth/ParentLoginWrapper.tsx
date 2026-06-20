'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from '@/lib/store';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import apiClient from '@/lib/api';
import Link from 'next/link';

function ParentLoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser, setToken, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push(user.isChild ? '/dashboard/child' : '/dashboard/parent');
    }
  }, [user, router]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleAuthCallback(code);
    }
  }, [searchParams]);

  const handleAuthCallback = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/api/auth/parent-login', { code });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setToken(token);
      router.push('/dashboard/parent');
    } catch (err: any) {
      console.error('Parent login error:', err);
      setError(err.response?.data?.error?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-sky-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-blue-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">👨‍👩‍👧 tinyChanges</h1>
          <p className="text-gray-600 font-medium">Parent Account Login</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Signing you in...</p>
          </div>
        )}

        <div className="space-y-4">
          <GoogleLoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Link
            href="/login/child"
            className="w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-700 font-semibold rounded-lg hover:from-cyan-200 hover:to-sky-200 transition border border-cyan-300"
          >
            👶 Child Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ParentLoginWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500" />}>
      <ParentLoginContent />
    </Suspense>
  );
}
