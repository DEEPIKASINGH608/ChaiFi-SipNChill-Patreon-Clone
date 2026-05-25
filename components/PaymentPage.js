"use client"
import React, { useState } from 'react'
import Script from 'next/script'
import { initiate } from '@/lib/api';
import { useSession } from 'next-auth/react';

const PaymentPage = ({ username = "" }) => {

    const [paymentform, setPaymentForm] = useState({ name: '', message: '', amount: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const pay = async (amount) => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter or select a valid amount.");
            return;
        }


        let a = await initiate(amount, username, paymentform);
        let orderId = a.id;

        var options = {
            "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            "amount": amount * 100,
            "currency": "INR",
            "name": "Acme Corp",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId,
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": {
                "name": paymentform.name || "Ansh Singh",
                "email": "ansh.singh@gmail.com",
                "contact": "9999999999"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='w-full bg-[#030712] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-950 to-black text-white pb-12 min-h-screen text-sm selection:bg-cyan-500 selection:text-black'>

                {/* Banner Section */}
                <div className='cover w-full relative h-[380px] overflow-hidden group'>
                    {/* Animated Background Glow behind the banner */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]"></div>

                    {/* Seamless Gradient Overlay blending directly into your page colors */}
                    <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-70% to-[#030712] z-10 pointer-events-none'></div>

                    <img
                        className='object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-[1.03] filter brightness-[0.9] contrast-[1.1] saturate-[1.05]'
                        src="/patreon_banner.gif"
                        alt="Banner"
                    />
                </div>

                {/* Profile Section */}
                <div className='info flex flex-col items-center mt-[-60px] pb-32 relative z-10'>

                    {/* Glowing Outer Ring around Profile Picture (Line Removed) */}
                    <div className='relative group'>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 shadow-[0_0_30px_rgba(147,51,234,0.3)]"></div>
                        <img
                            className='relative rounded-full h-[110px] w-[110px] border-4 border-[#030712] object-cover bg-black shadow-2xl transition-transform duration-300 group-hover:scale-105'
                            src="/cat.jpg"
                            alt="Profile"
                        />
                    </div>

                    {/* User Info Typography */}
                    <div className='gap-1.5 mt-5 flex flex-col items-center text-center px-4'>
                        <h1 className='font-extrabold text-3xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm'>
                            @{username}
                        </h1>
                        <div className='text-slate-400 text-sm max-w-lg font-medium'>
                            Creating Animated art for VTT's
                        </div>

                        {/* Badge design for stats */}
                        <div className='bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold mt-2 px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)]'>
                            🚀 9,917 patrons • $29,000 per month
                        </div>
                    </div>

                    {/* Main Content Blocks */}
                    <div className="payment flex flex-col md:flex-row gap-6 w-1/2 lg:w-[60%] mt-12">

                        {/* Supporters Section */}
                        <div className="supporters w-full md:w-1/2 bg-slate-950/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl min-h-[300px] shadow-2xl">
                            <h2 className='text-lg font-bold mb-6 border-b border-white/5 pb-3 text-slate-200 flex items-center gap-2'>
                                <span className="text-purple-400">⚡</span> Supporters
                            </h2>

                            <ul className='text-slate-300 text-lg space-y-4'>
                                <li className="flex flex-col group/item">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="/avatar4.png"
                                            alt=""
                                            className='rounded-full size-8 object-cover border border-white/10 transition-transform group-hover/item:scale-110'
                                        />
                                        <span className="font-bold text-cyan-400 text-base">Shubham</span>
                                    </div>
                                    <span className="text-slate-400 italic mt-1 text-sm pl-10">
                                        Subham donated <span className="text-emerald-400 font-semibold">$20!</span> with a message "Keep up the great work!"
                                    </span>
                                </li>

                                <li className="flex flex-col group/item">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="/avatar3.png"
                                            alt=""
                                            className='rounded-full size-8 object-cover border border-white/10 transition-transform group-hover/item:scale-110'
                                        />
                                        <span className="font-bold text-cyan-400 text-base">Jane Smith</span>
                                    </div>
                                    <span className="text-slate-400 italic mt-1 text-sm pl-10">
                                        Jane donated <span className="text-emerald-400 font-semibold">$50!</span> with a message "Your art is amazing! Can't wait to see more!"
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Make Payment Section */}
                        <div className="makePayment w-1/2 bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/5 p-6 rounded-2xl min-h-[300px] shadow-2xl relative overflow-hidden">
                            {/* Ambient background light within the payment card */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                            <h2 className="text-lg font-bold mb-4 tracking-tight text-slate-200 flex items-center gap-2">
                                <span className="text-cyan-400">☕</span> Make a Payment
                            </h2>

                            <div className="flex flex-col gap-3">
                                <input onChange={handleChange} value={paymentform.name || ''} name="name"
                                    type="text"
                                    placeholder="Name"
                                    className="w-full p-3 text-sm rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.07] outline-none transition-all placeholder:text-slate-500"
                                />
                                <input onChange={handleChange} value={paymentform.message || ''} name="message"
                                    type="text"
                                    placeholder="Message"
                                    className="w-full p-3 text-sm rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.07] outline-none transition-all placeholder:text-slate-500"
                                />

                                <div className="flex gap-2 w-full">
                                    <input onChange={handleChange} value={paymentform.amount || ''} name="amount"
                                        type="number"
                                        placeholder="Amount"
                                        className="min-w-0 flex-1 p-3 text-sm rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.07] outline-none transition-all placeholder:text-slate-500"
                                    />
                                    {/* FIX 3: Bound onClick hook directly into the payment processing function */}
                                    <button onClick={() => pay(paymentform.amount)} id="rzp-button1" className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold py-2 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95">
                                        Pay
                                    </button>
                                </div>

                                {/* Quick Select Buttons */}
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {/* FIX 4: Mapped string loops with clean integers to update amount value and trigger immediate checkout options correctly */}
                                    {['1000', '2000', '3000'].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setPaymentForm({ ...paymentform, amount: amt })}
                                            className="flex-1 min-w-[60px] p-2 text-xs font-semibold rounded-lg bg-white/[0.03] border border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all active:scale-95"
                                        >
                                            ₹{amt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage;


