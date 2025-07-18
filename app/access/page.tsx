import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Page = () => {
  return (
    <>
      <section className=" bg-gradient-to-br from-slate-50 via-white to-green-50 font-['Inter']">
        <Navbar />
        {/* Hero Section with Background Video */}
        <div className="relative py-16 px-6 md:px-16 lg:px-24 min-h-screen">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/video/Access.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto">
            {/* Text Content - Left Aligned */}
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-['Inter'] mt-20">
                Not all access is granted. Some is earned.
              </h1>
              <p className="text-lg md:text-xl text-white leading-relaxed font-['Inter'] opacity-90">
                We map hidden potential to high-opportunity zones. Through
                intelligent match layers, algorithmic fitment, and behavioral
                edge detection, our platform opens portals — not gates.
              </p>
              <p className="text-lg md:text-xl text-white leading-relaxed font-['Inter'] opacity-90">
                Whether you're an institution, a learner, or a hiring partner —
                what you gain access to isn't just a dashboard. It's a living
                system designed to unlock pathways no résumé can.
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3 font-['Inter']">
                🟩 Opportunity Layers
              </h3>
              <p className="text-slate-700 font-['Inter']">
                We don't match talent to jobs. We match potential to possibility
                — through role-AI fit modeling.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3 font-['Inter']">
                🟩 Gateways, Not Walls
              </h3>
              <p className="text-slate-700 font-['Inter']">
                We open personalized access paths for learners, institutions,
                and employers based on authentic signal.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3 font-['Inter']">
                🟩 Dynamic Fit Graph
              </h3>
              <p className="text-slate-700 font-['Inter']">
                Access is earned through engagement, not just credentials —
                driven by live feedback and skill delta.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
};

export default Page;
