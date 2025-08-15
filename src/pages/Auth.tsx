import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/Seo';

export default function Auth() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Seo 
        title="Sign In - TimeCraft"
        description="Sign in to TimeCraft to manage your time and tasks efficiently"
      />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
        <AuthForm onSuccess={() => navigate('/', { replace: true })} />
      </main>
    </>
  );
}
