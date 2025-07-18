import React from "react";
import { Layers, Lock, TrendingUp } from "lucide-react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      <Navbar />
      <section className="pt-4 md:pt-14 bg-gradient-to-br from-slate-50 via-white to-green-50 font-['Inter']">
        {/* Hero Section */}
        <div className="relative py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl text-slate-700 leading-relaxed font-['Inter']">
                NOT ALL ACCESS IS GRANTED. SOME IS EARNED.
              </h1>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                We map hidden potential to high-opportunity zones. Through
                intelligent match layers, algorithmic fitment, and behavioral
                edge detection, our platform opens portals — not gates.
              </p>
              <p className="text-base text-slate-700 leading-relaxed font-['Inter']">
                Whether you're an institution, a learner, or a hiring partner —
                what you gain access to isn't just a dashboard. It's a living
                system designed to unlock pathways no résumé can.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <Image
                src="/images/Readiness.jpg"
                alt="Access Platform Illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-md object-cover"
              />
            </div>
          </div>

          {/* Section Cards - Updated Design */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
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
    </>
  );
};

export default Page;
