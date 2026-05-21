"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  // State for form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    profilepic: "",
    coverpic: "",
    razorpayid: "",
    razorpaysecret: ""
  })

  // 1. Protection and Redirection Hook
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push('/login')
    }
  }, [session, status, router])

  // 2. Hydration and Console Logging Hook (To match Harry's screen!)
  useEffect(() => {
    if (session && session.user) {
      // THIS IS THE EXACT LOG FROM THE VIDEO!
      console.log(session.user)

      // Automatically fill inputs with GitHub session values
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        username: session.user.username || "",
        profilepic: session.user.image || "",
        coverpic: "", // Keep blank until they upload one
        razorpayid: "",
        razorpaysecret: ""
      })
    }
  }, [session])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    )
  }

  if (!session) return null

  return (
    <div className='container mx-auto py-10 px-4 text-white min-h-screen'>
      <h1 className='text-center mb-10 text-3xl font-bold'>Welcome to your Dashboard</h1>

      <div className='flex flex-col gap-5 max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-white/5 shadow-xl'>

        {/* Input Groups */}
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Username", name: "username", type: "text" },
          { label: "Profile Picture", name: "profilepic", type: "text" },
          { label: "Cover Picture", name: "coverpic", type: "text" },
          { label: "Razorpay ID", name: "razorpayid", type: "text" },
          { label: "Razorpay Secret", name: "razorpaysecret", type: "password" },
        ].map((field) => (
          <div key={field.name} className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-slate-400 uppercase tracking-wider ml-1'>
              {field.label}
            </label>
            <input
              value={form[field.name] || ""} // Fallback value to prevent undefined warning
              onChange={handleChange}
              name={field.name}
              type={field.type}
              className='w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm'
            />
          </div>
        ))}

        <button className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl mt-4 transition-all shadow-lg active:scale-[0.98]'>
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Dashboard


