"use client";
import { Mail, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const pathname = usePathname();
    const isDashboard = pathname === "/dashboard";
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 h-20 w-full flex justify-between items-center px-6 md:px-12 z-50 transition-all duration-700 ${isDashboard ? "bg-gray-950/80 backdrop-blur-2xl" : "bg-transparent"}`}>
            <Link
                href="/"
                className='flex items-center gap-3 cursor-pointer group'
                onClick={() => setIsOpen(false)}
            >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h1 className='text-white font-bold text-lg md:text-xl tracking-tight text-nowrap'>
                    <span className="hidden sm:inline">AI Email Voice Agent</span>
                    <span className="sm:hidden">Voice Agent</span>
                </h1>
            </Link>

            {/* Desktop Nav */}
            <div className='hidden md:flex items-center rounded-2xl gap-8 px-8 py-2.5 bg-white/5 backdrop-blur-md border border-white/10'>
                <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</Link>
                <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Use the Agent</Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-white/70 hover:text-white p-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-3xl border-b border-white/5 flex flex-col p-6 gap-4 md:hidden"
                    >
                        <Link
                            href="/"
                            className="text-lg font-medium text-white/70 hover:text-white py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-lg font-medium text-white/70 hover:text-white py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Use the Agent
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;