"use client";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden h-screen w-screen bg-[#030303]">
      <Navbar />
      <Hero />
    </div>
  );
};

export default LandingPage;