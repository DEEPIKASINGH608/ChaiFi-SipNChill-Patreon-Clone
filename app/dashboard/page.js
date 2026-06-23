"use client";
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Welcome back, {session.user?.name}!</h1>

    </div>
  );
};

export default Dashboard;



