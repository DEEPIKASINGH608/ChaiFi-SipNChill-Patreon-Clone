"use client"
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react';
import { fetchuser, fetchpayments } from '@/actions/useractions'
import { initiate } from '@/lib/api'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const PaymentPage = ({ username = "" }) => {
    const { data: session } = useSession();
    const [paymentform, setPaymentForm] = useState({ name: '', message: '', amount: '' });
    const [currentUser, setcurrentUser] = useState({});
    const [payments, setPayments] = useState([])
    const searchParams = useSearchParams();
    const router = useRouter();


    useEffect(() => {
        const getData = async () => {
            let dbPayments = await fetchpayments(username);
            setPayments(dbPayments || []);

            let dbUser = await fetchuser(username);
            if (dbUser) {
                setcurrentUser(dbUser);
            }
        };

        if (username) {
            getData();
        }
    }, [username]);


    useEffect(() => {
        if (searchParams.get("paymentdone") === "true" )
            {
            toast('Thanks for your payment!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const isValidUrl = (url) => {
        if (!url) return false;
        if (url === "https://" || url === "http://") return false;
        return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
    };

    const pay = async (amount) => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter or select a valid amount.");
            return;
        }

        try {
            let a = await initiate(amount, username, paymentform);

            if (!a || !a.id) {
                alert("Server Error: The initiate() action failed to return a valid Razorpay Order ID.");
                return;
            }

            let orderId = a.id;
            if (!window.Razorpay) {
                alert("Razorpay SDK failed to load. Please check your internet connection or reload the page.");
                return;
            }

            var options = {
                "key": currentUser.razorpayid || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                "amount": amount * 100,
                "currency": "INR",
                "name": "ChaiFi dApp",
                "description": paymentform.message || "Support Contribution",
                "image": currentUser.profilepic || "/cat.jpg",
                "order_id": orderId,
                "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
                "prefill": {
                    "name": paymentform.name || "Anonymous User",
                    "email": session?.user?.email || "supporter@chaifi.com",
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

        } catch (error) {
            console.error("Payment processing failed:", error);
            alert("Payment failed to initialize! Error: " + error.message);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='w-full bg-[#030712] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-950 to-black text-white pb-12 min-h-screen text-sm selection:bg-cyan-500 selection:text-black'>

                {/* Banner Section */}
                <div className='coverPiczz w-full relative h-[380px] overflow-hidden group'>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]"></div>

                    <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-70% to-[#030712] z-10 pointer-events-none'></div>

                    <img
                        className='object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-[1.03] filter brightness-[0.9] contrast-[1.1] saturate-[1.05]'
                        src={currentUser.coverpic || "/patreon_banner.gif"}
                        alt="Banner"
                    />
                </div>

                {/* Profile Section */}
                <div className='info flex flex-col items-center mt-[-60px] pb-32 relative z-10'>

                    <div className='relative group'>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 shadow-[0_0_30px_rgba(147,51,234,0.3)]"></div>
                        <img
                            className='relative rounded-full h-[110px] w-[110px] border-4 border-[#030712] object-cover bg-black shadow-2xl transition-transform duration-300 group-hover:scale-105'
                            src={currentUser.profilepic || "/cat.jpg"}
                            alt="Profile"
                        />
                    </div>

                    {/* User Info Typography */}
                    <div className='gap-1.5 mt-5 flex flex-col items-center text-center px-4'>
                        <h1 className='font-extrabold text-3xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm'>
                            @{username}
                        </h1>
                        <div className='text-slate-400 text-sm max-w-lg font-medium'>
                            {currentUser.name ? `Supporting ${currentUser.name}` : `Lets help ${username} with their work!`}
                        </div>

                        {/* Badge design for stats */}
                        <div className='bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold mt-2 px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)]'>
                             {payments.length} Payments  • ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
                        </div>
                    </div>

                    {/* Main Content Blocks */}
                    <div className="payment flex flex-col md:flex-row gap-6 w-11/12 max-w-5xl mt-12">

                        {/* Supporters Section */}
                        <div className="supporters w-full md:w-1/2 bg-slate-950/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl min-h-[300px] shadow-2xl">
                            <h2 className='text-lg font-bold mb-6 border-b border-white/5 pb-3 text-slate-200 flex items-center gap-2'>
                                <span className="text-purple-400">⚡</span> Supporters
                            </h2>

                            <ul className='text-slate-300 space-y-4 text-sm'>
                                {payments.length === 0 && (
                                    <li className="text-slate-500 text-center mt-10 text-sm">
                                        No supporters yet. Be the first!
                                    </li>
                                )}

                                {payments.map((payment, index) => (
                                    <li key={index} className="flex flex-col group/item border-b border-white/5 pb-2" >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src="/cat.jpg"
                                                alt={payment.name}
                                                className='rounded-full size-8 object-cover border border-white/10 transition-transform group-hover/item:scale-110'
                                            />
                                            <span className="font-bold text-cyan-400 text-base">
                                                {payment.name}
                                                <span className="text-slate-400 font-normal text-sm"> donated </span>
                                                <span className="text-emerald-400">₹{Number(payment.amount) / 100}</span>
                                            </span>
                                        </div>
                                        <span className="text-slate-400 italic mt-1 text-sm pl-10">
                                            "{payment.message}"
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Payment Section */}
                        <div className="makePayment w-full md:w-1/2 bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/5 p-6 rounded-2xl min-h-[300px] shadow-2xl relative overflow-hidden">
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

                                    <button onClick={() => pay(Number.parseInt(paymentform.amount))} id="rzp-button1" className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold py-2 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95 disabled:bg-purple-100 disabled:from-purple-100" disabled={paymentform.name.length < 3 || paymentform.message.length < 4 || !paymentform.amount}>
                                        Pay
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-1">
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


