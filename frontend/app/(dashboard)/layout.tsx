'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import apiClient from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, setIsLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      if (!user) {
        try {
          const response = await apiClient.get('/api/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [user, router, setUser, setIsLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
