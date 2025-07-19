"use client";
import React from "react";
import { Users, ArrowRight, Zap, Target, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router=useRouter();

  const stats = [
    { number: "50K+", label: "Professionals Trained", icon: Users },
    { number: "500+", label: "Partner Companies", icon: Globe },
    { number: "95%", label: "Success Rate", icon: Target },
    { number: "24/7", label: "Global Support", icon: Zap },
  ];

  const handleStartJourney = () => {
    router.push("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 overflow-hidden relative">
        {/* Hero Section with Video Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/video/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark Overlay for Better Text Contrast */}
          <div className="absolute inset-0 bg-black/40 z-5"></div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 mt-10">
            <div className="max-w-5xl mx-auto mt-10">
              <h1 className="text-xl sm:text-3xl md:text-7xl font-bold mb-6 leading-tight px-2">
                <span className="text-white drop-shadow-2xl mt-15">
                  WHAT IF TALENT COULD
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                  SPEAK FOR ITSELF ?
                </span>
              </h1>

              <div className="mb-8 sm:mb-12">
                <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4 mb-4 drop-shadow-lg">
                  We built the system that listens.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  XWORKS is building the world's first AI Talent Intelligence
                  Ecosystem.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Discover who's ready. Develop who's rising. Deploy who
                  matters.
                </p>
              </div>

              <div className="flex justify-center items-center mb-8 sm:mb-6 px-4">
                <button 
                  onClick={handleStartJourney}
                  className="group bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg md:text-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all transform hover:scale-105 flex items-center hover:from-emerald-600 hover:to-cyan-600 active:scale-95 justify-center border-2 border-white/20 backdrop-blur-sm cursor-pointer"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto px-4 mb-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/40 hover:border-emerald-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer group transform hover:scale-105 hover:bg-white"
                    >
                      <div className="flex items-center justify-center mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-all duration-300">
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 group-hover:text-cyan-600 transition-colors" />
                        </div>
                      </div>
                      <div className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                        {stat.number}
                      </div>
                      <div className="text-slate-700 text-xs sm:text-sm font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;