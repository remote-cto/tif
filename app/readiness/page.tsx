//app/readiness/page.tsx

import React from "react";
import { Activity, Zap, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const Page = () => {
  const cards = [
    {
      title: "Signal Mapping",
      description: "We capture micro-patterns often lost in traditional assessments — to uncover latent potential.",
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Alignment Engine",
      description: "Our Readiness Model adapts to evolving industry thresholds — not yesterday's benchmarks.",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Beyond Scores",
      description: "Readiness is not just measured. It's interpreted, calibrated, and forecasted — in real-time.",
      icon: TrendingUp,
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <section className="bg-white font-['Inter']">
     <Navbar/>

      {/* === SECTION 1: Hero Section with Video Background === */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="relative py-24 px-6 md:px-16 lg:px-24 overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/video/readiness.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content - Left Side */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed font-['Inter'] font-light mt-5">
                THE READINESS INTELLIGENCE LAYER
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-['Inter'] font-light">
                Every individual emits signals — patterns of skill, pace, and
                potential. Most systems miss them.
              </p>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Inter'] font-light">
                At <span className="font-bold text-yellow-300 font-['Inter']">XWORKS</span>,
                readiness is not a score. It's a multi-dimensional alignment — of
                cognition, adaptability, and industry signal resonance. We don't
                just measure talent. We tune into it.
              </p>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Inter'] font-light">
                Behind the radar lies a proprietary readiness engine — trained on
                future-of-work indicators, calibrated with employer thresholds,
                and constantly learning from behavioral flux. What you see is just
                the surface.
              </p>
            </div>

            {/* Right Side - Empty space for video to show through */}
            <div className="flex-1 flex justify-center items-center"></div>
          </div>

          {/* Cards Section - Updated to match model page design with glass effect */}
          <div className="relative z-10 mt-16 grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group relative transition-all duration-500 hover:scale-105"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col justify-center border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`bg-gradient-to-r ${card.color} rounded-full p-3`}
                    >
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-4 font-['Inter']">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 text-center leading-relaxed font-['Inter']">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </section>
  );
};

export default Page;