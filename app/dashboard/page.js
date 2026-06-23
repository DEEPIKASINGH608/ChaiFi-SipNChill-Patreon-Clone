import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  // 1. Grab both session and status
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 2. ONLY redirect if NextAuth has finished loading AND confirms no user exists
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 3. Show a loading state while NextAuth is checking the session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // 4. Only render the actual dashboard UI if authenticated
  if (!session) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Welcome back, {session.user?.name}!</h1>
      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;


