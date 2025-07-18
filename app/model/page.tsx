//app/model/page.tsx
import React from "react";
import { MapPin, CheckCircle, Target, Users } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Page = () => {
  const cards = [
    {
      title: "Mapping Talent",
      description: "We identify signals of ability, adaptability, and domain fit.",
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Readiness Engine",
      description: "We validate if someone is truly deployable — not just teachable.",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Capability Building",
      description: "We guide learners through sprint-based, outcome-driven journeys.",
      icon: Target,
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <section className="bg-white font-['Inter']">
      <Navbar />

      {/* === SECTION 1: Hero Section with Image === */}
      <section className="pt-4 md:pt-14 bg-gradient-to-br from-slate-50 via-white to-green-50">
        <div className="relative py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl text-slate-700 leading-relaxed font-['Inter']">
                THE INTELLIGENCE LAYER BENEATH TALENT
              </h1>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                At XWORKS, we don't run programs — we run a{" "}
                <span className="font-bold text-blue-600 font-['Inter']">
                  Talent Intelligence Framework
                </span>
                .
              </p>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                This framework is our model — a living, evolving system that maps
                potential, validates readiness, builds real capability, and opens
                access to opportunities that matter.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <img
                src="/images/Readiness.jpg"
                alt="Talent Intelligence Framework"
                width={600}
                height={400}
                className="rounded-xl shadow-md object-cover w-full"
              />
            </div>
          </div>

          {/* Cards Section - Fixed with proper container */}
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