"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signals, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser,  updateProfile } from '@/actions/useractions'
const Dashboard = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [form, setForm] = useState({ name: "", email: "", username: "", profilepic: "", coverpic: "", razorpayid: "", razorpaysecret: "" })

    useEffect{() => {
        getData()
        if (!session) {
            router.push('/logic')
        }
    }, [router, session]}

    const getData = async () => {
        let u = await fetchuser(session.user.name)
        setForm(u)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async(e) => {
        update()
        let a = await updateProfile(e, session.user.name)
        alert("Profile updated")
    }



    return (
        <div className='container mx-auto py-0 px-0'>
            <h1 className='text-center my-3 text-2xl font-bold'>My Dashboard</h1>

            <form className='max-w-2xl mx-auto' onSubmit = {handleSubmit}>

            </form>


            <div className='max-w-md mx-auto flex flex-col gap-3 bg-[#0f172a] p-6 rounded-xl border border-white/5'>

                {/* Name */}
                <div className='flex flex-col.5 w-full max-w-sm mx-auto'>
                    <label htmlFor="name" className='text-sm font-semibold'>Name</label>
                    <input value={form.name} onChange={handleChange} name='name' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* Email */}
                <div className='flex flex-col'>
                    <label htmlFor="email" className='text-sm font-semibold'>Email</label>
                    <input value={form.email} onChange={handleChange} name='email' type="email" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* Username */}
                <div className='flex flex-col'>
                    <label htmlFor="username" className='text-sm font-semibold'>Username</label>
                    <input value={form.username} onChange={handleChange} name='username' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* Profile Picture */}
                <div className='flex flex-col'>
                    <label htmlFor="profilepic" className='text-sm font-semibold'>Profile</label>
                    <input value={form.profilepic} onChange={handleChange} name='profilepic' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* Cover Picture */}
                <div className='flex flex-col'>
                    <label htmlFor="coverpic" className='text-sm font-semibold'>Cover Picture</label>
                    <input value={form.coverpic} onChange={handleChange} name='coverpic' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* Razorpay Credentials */}
                <div className='flex flex-col'>
                    <label htmlFor="razorpayid" className='text-sm font-semibold'>Razorpay Id</label>
                    <input value={form.razorpayid} onChange={handleChange} name='razorpayid' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                <div className='flex flex-col'>
                    <label htmlFor="razorpaysecret" className='text-sm font-semibold'>Razorpay Secret</label>
                    <input value={form.razorpaysecret} onChange={handleChange} name='razorpaysecret' type="password" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* Save Button */}
                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 transition-all'>
                    Save
                </button>
            </div>

        </div>
    )
}

export default Dashboard

