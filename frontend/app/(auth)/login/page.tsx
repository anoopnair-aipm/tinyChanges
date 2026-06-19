'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import apiClient from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser, setToken, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push(user.isChild ? '/dashboard/child' : '/dashboard/parent');
    }
  }, [user, router]);

  // Handle OAuth callback
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
      const response = await apiClient.post('/api/auth/login', { code });
      const { token, user: userData } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Store user in Zustand store
      setUser(userData);
      setToken(token);

      // Redirect to dashboard
      router.push(userData.isChild ? '/dashboard/child' : '/dashboard/parent');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 tinyChanges</h1>
          <p className="text-gray-600">Parent & Guardian Login</p>
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
              <span className="px-2 bg-white text-gray-500">Or continue as</span>
            </div>
          </div>

          <Link
            href="/login/child"
            className="w-full px-6 py-3 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition text-center"
          >
            👶 Child Login
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          First time here?{' '}
          <span className="text-indigo-600 font-medium">
            Create an account with Google above
          </span>
        </p>
      </div>
    </div>
  );
}
