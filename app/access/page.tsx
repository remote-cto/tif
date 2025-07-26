//app/access/page.tsx

import React from "react";
import { Layers, Lock, TrendingUp } from "lucide-react";
import Image from "next/image";

import Footer from "../components/Footer";
import NewNavbar from "../components/NewNavbar";

const Page = () => {
  const cards = [
    {
      title: "Opportunity Layers",
      description:
        "We don't match talent to jobs. We match potential to possibility — through role-AI fit modeling.",
      icon: Layers,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Gateways, Not Walls",
      description:
        "We open personalized access paths for learners, institutions, and employers based on authentic signal.",
      icon: Lock,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Dynamic Fit Graph",
      description:
        "Access is earned through engagement, not just credentials — driven by live feedback and skill delta.",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <>
      <NewNavbar />
      <section className="bg-gradient-to-br from-slate-50 via-white to-green-50 font-['Inter']">
        {/* Hero Section with Video Background */}
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
              <source src="/video/BgNew.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content - Left Side */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed font-['Inter'] font-light mt-5">
                NOT ALL ACCESS IS GRANTED. SOME IS EARNED.
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-['Inter'] font-light">
                We map hidden potential to high-opportunity zones. Through
                intelligent match layers, algorithmic fitment, and behavioral
                edge detection, our platform opens portals — not gates.
              </p>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Inter'] font-light">
                Whether you're an institution, a learner, or a hiring partner —
                what you gain access to isn't just a dashboard. It's a{" "}
                <span className="font-bold text-yellow-300 font-['Inter']">
                  living system
                </span>{" "}
                designed to unlock pathways no résumé can.
              </p>
            </div>

            {/* Right Side - Empty space for video to show through */}
            <div className="flex-1 flex justify-center items-center"></div>
          </div>

          {/* Cards Section - Updated with glass effect */}
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
    </>
  );
};

export default Page;