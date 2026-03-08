"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const isDashboard = pathname === "/dashboard";

    return (
        <div className={`fixed top-0 left-0 right-0 h-20 w-full flex justify-between items-center px-12 z-50 transition-all duration-700 ${isDashboard ? "bg-gray-950 backdrop-blur-2xl" : "bg-transparent"}`}>
            <Link
                href="/"
                className='flex items-center gap-3 cursor-pointer group'
            >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="text-white w-6 h-6" />
                </div>
                <h1 className='text-white font-bold text-xl tracking-tight text-nowrap'>AI Email Voice Agent</h1>
            </Link>

            <div className='hidden md:flex items-center rounded-2xl gap-8 px-8 py-2.5 bg-white/5 backdrop-blur-md border border-white/10'>
                <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</Link>
                <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Use the Agent</Link>
            </div>
        </div>
    )
}

export default Navbar