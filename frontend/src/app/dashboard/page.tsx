"use client";
import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";

const DashboardPage = () => {
    return (
        <div className="relative overflow-hidden h-screen w-screen bg-[#030303]">
            <Navbar />
            <div className="pt-20 h-full">
                <Chat />
            </div>
        </div>
    );
};

export default DashboardPage;
