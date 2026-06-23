"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { useSession, } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const { data: session, update } = useSession()
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


    const getData = useCallback(async () => {
        const currentUsername = session?.user?.username || session?.user?.name;
        if (currentUsername) {
            let u = await fetchuser(currentUsername)
            setForm(u || {})
        }
    }, [session]);


    useEffect(() => {
        if (session === null) {
            router.push('/login')
        } else if (session) {
            getData()
        }

    }, [router, session, getData]
    )

    const handleChange = async (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const currentUsername = session?.user?.username || session?.user?.name;
        if (!currentUsername) {
            alert("Session error: User identity not found.")
            return;
        }
        const { _id, __v, createdAt, updatedAt, ...cleanFormData } = form;

        try {
            const res = await updateProfile(currentUsername, cleanFormData)

            if (res && res.success === false) {
                toast.error(res.message || "Failed to update profile database.");
                return;
            }

            // Fire toast first before changing the session state
            toast.success('Profile updated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            });

            await update({
                name: cleanFormData.name,
                username: cleanFormData.username,
                email: cleanFormData.email,
                profilepic: cleanFormData.profilepic,
                coverpic: cleanFormData.coverpic,
                razorpayid: cleanFormData.razorpayid,
                razorpaysecret: cleanFormData.razorpaysecret
            })

            setTimeout(() => {
                if (currentUsername === cleanFormData.username) {
                    router.push(`/${cleanFormData.username}`)
                } else {
                    window.location.href = `${window.location.origin}/${cleanFormData.username}`
                }
            }, 2000);

        } catch (err) {
            console.error("Failed to update profile:", err)
            alert("Error updating profile: " + err.message)
        }
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className='container mx-auto py-0 px-0'>
                <h1 className='text-center my-3 text-2xl font-bold'>My Dashboard</h1>
                <form className='max-w-2xl mx-auto' onSubmit={handleSubmit}>
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
                        {/* profile Picture */}
                        <div className='flex flex-col'>
                            <label htmlFor="profilepic" className='text-sm font-semibold'>Profile Picture</label>
                            <input value={form.profilepic ? form.profilepic : ""} onChange={handleChange} name='profilepic' id='profilepic' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        {/* Cover Picture */}
                        <div className='flex flex-col'>
                            <label htmlFor="coverpic" className='text-sm font-semibold'>Cover Picture</label>
                            <input value={form.coverpic ? form.coverpic : ""} onChange={handleChange} name='coverpic' id='coverpic' type="text" className='w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
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
                </form>
            </div>
        </>
    )
}

export default Dashboard

