//app/model/page.tsx
import React from "react";
import { MapPin, CheckCircle, Target } from "lucide-react";
import Footer from "../components/Footer";

import Navbar from "../components/Navbar";

const Page = () => {
  const cards = [
    {
      title: "Mapping Talent",
      description:
        "We identify signals of ability, adaptability, and domain fit.",
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Readiness Engine",
      description:
        "We validate if someone is truly deployable — not just teachable.",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Capability Building",
      description:
        "We guide learners through sprint-based, outcome-driven journeys.",
      icon: Target,
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <section className="bg-white font-['Inter']">
     <Navbar/>

      
      <section className=" bg-gradient-to-br from-slate-50 via-white to-green-50">
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
              <source src="/video/model.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content - Left Side */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed font-['Inter'] font-light mt-5">
                THE INTELLIGENCE LAYER BENEATH TALENT
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-['Inter'] font-light">
                At XWORKS, we don't run programs — we run a{" "}
                <span className="font-bold text-yellow-300 font-['Inter']">
                  Talent Intelligence Framework
                </span>
                .
              </p>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Inter'] font-light">
                This framework is our model — a living, evolving system that
                maps potential, validates readiness, builds real capability, and
                opens access to opportunities that matter.
              </p>
            </div>

            <div className="flex-1 flex justify-center items-center"></div>
          </div>

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
