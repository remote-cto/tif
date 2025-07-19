import React from "react";
import { Activity, Zap, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewNavbar from "../components/NewNavbar";

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
      description: "Our Readiness model adapts to evolving industry thresholds — not yesterday's benchmarks.",
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
      <NewNavbar />

      {/* === SECTION 1: Hero Section with Image === */}
      <section className="pt-4 md:pt-14 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="relative py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl text-slate-700 leading-relaxed font-['Inter']">
                THE READINESS INTELLIGENCE LAYER
              </h1>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                Every individual emits signals — patterns of skill, pace, and
                potential. Most systems miss them.
              </p>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                At <span className="font-bold text-blue-600 font-['Inter']">XWORKS</span>,
                readiness is not a score. It's a multi-dimensional alignment — of
                cognition, adaptability, and industry signal resonance. We don't
                just measure talent. We tune into it.
              </p>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                Behind the radar lies a proprietary readiness engine — trained on
                future-of-work indicators, calibrated with employer thresholds,
                and constantly learning from behavioral flux. What you see is just
                the surface.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <img
                src="/images/Readiness.jpg"
                alt="Readiness Engine Illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-md object-cover w-full"
              />
            </div>
          </div>

          {/* Cards Section - Updated to match model page design */}
          <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group relative transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`bg-gradient-to-r ${card.color} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col justify-center`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <card.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-4 font-['Inter']">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/90 text-center leading-relaxed font-['Inter']">
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