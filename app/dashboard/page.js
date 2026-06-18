"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile } from '@/actions/useractions'

const Dashboard = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    profilepic: "",
    coverpic: "",
    razorpayid: "",
    razorpaysecret: ""
  })

  // Protect route client-side
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push('/login')
    }
  }, [session, status, router])

  // Fetch true existing profile metrics from DB on session mount
  useEffect(() => {
    const getData = async () => {
      const currentUsername = session?.user?.username || session?.user?.name;
      if (currentUsername) {
        let dbUser = await fetchuser(currentUsername)
        if (dbUser) {
          setForm({
            name: dbUser.name || "",
            email: dbUser.email || "",
            username: dbUser.username || "",
            profilepic: dbUser.profilepic || "",
            coverpic: dbUser.coverpic || "",
            razorpayid: dbUser.razorpayid || "",
            razorpaysecret: dbUser.razorpaysecret || ""
          })
        }
      }
    }

    if (session) {
      getData()
    }
  }, [session])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const currentUsername = session?.user?.username || session?.user?.name;
    if (!currentUsername) {
      alert("Session error: Identity token missing.")
      return
    }

    // Strip out internal Mongoose structural metadata if present
    const { _id, __v, createdAt, updatedAt, ...cleanFormData } = form;

    try {
      // 1. Commit update values directly to MongoDB
      const res = await updateProfile(currentUsername, cleanFormData)

      if (res && res.success === false) {
        alert(` ${res.message}`)
        return
      }

      // 2. Broadcast structural changes over client-side NextAuth context
      await update({
        name: cleanFormData.name,
        username: cleanFormData.username,
        email: cleanFormData.email,
        profilepic: cleanFormData.profilepic,
        coverpic: cleanFormData.coverpic,
        razorpayid: cleanFormData.razorpayid,
        razorpaysecret: cleanFormData.razorpaysecret
      })

      alert("Profile properties saved successfully!")
    } catch (err) {
      console.error("Failed to commit settings alterations:", err)
      alert("Error saving changes: " + err.message)
    }
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
      <h1 className='text-center mb-10 text-3xl font-bold'>My Dashboard</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5 max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-white/5 shadow-xl'>

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
              value={form[field.name] || ""}
              onChange={handleChange}
              name={field.name}
              type={field.type}
              className='w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm'
            />
          </div>
        ))}

        <button type="submit" className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl mt-4 transition-all shadow-lg active:scale-[0.98]'>
          Save Settings
        </button>
      </form>
    </div>
  )
}

export default Dashboard



