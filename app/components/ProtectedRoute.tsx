// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional prop to specify allowed roles
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        router.push('/login');
      } else if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        // If user doesn't have the required role, redirect to their dashboard or show unauthorized
        switch (user.role) {
          case 'ADMIN':
            router.push('/adminDashboard');
            break;
          case 'OPERATOR':
            router.push('/staffDashboard');
            break;
          case 'CLIENT':
            router.push('/dashboard');
            break;
          default:
            router.push('/'); // Fallback to home or login
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles, pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check if route is restricted by role
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  return <>{children}</>;
}