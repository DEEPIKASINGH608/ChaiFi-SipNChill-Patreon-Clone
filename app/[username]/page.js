import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation";
import connectDB from '@/db/connectDb';
import User from '@/models/User';


const Username = async ({ params }) => {
    const { username } = await params;

    await connectDB();
    let u = await User.findOne({ username: username });
    if (!u) {
        return notFound();
    }

    return (
        <>
            <PaymentPage username={username} />
        </>
    );
};
export default Username;


export async function generateMetadata({ params })  {
    const { username } = await params;
    return {
    title : `Support ${username} - Chaify`,
    }
}



