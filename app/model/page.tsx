import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Page = () => {
  return (
    <section className="bg-white font-['Inter']">
      <Navbar />

      {/* === SECTION 1: Text Over Fullscreen Video === */}
      <div className="relative h-[100vh] w-full overflow-hidden">
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

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />

        {/* Text Content */}
        <div className="relative z-20 h-full flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-white font-['Inter']">
              The Intelligence Layer Beneath Talent
            </h3>

            <p className="text-lg md:text-xl text-white leading-relaxed font-['Inter']">
              At XWORKS, we don't run programs — we run a{" "}
              <span className="font-bold text-blue-300 font-['Inter']">
                Talent Intelligence Framework
              </span>
              .
            </p>

            <p className="text-lg md:text-xl text-white leading-relaxed font-['Inter']">
              This framework is our model — a living, evolving system that maps
              potential, validates readiness, builds real capability, and opens
              access to opportunities that matter.
            </p>
          </div>
        </div>
      </div>

      {/* === SECTION 2: Normal Content (Cards etc.) === */}
      <div className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <h4 className="text-2xl font-bold text-slate-800 mb-8 text-left font-['Inter']">
          It works across four core layers:
        </h4>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition hover:shadow-lg">
            <h5 className="text-lg font-bold text-blue-700 mb-2 font-['Inter']">1. Mapping Talent</h5>
            <p className="text-slate-700 font-['Inter']">
              We identify signals of ability, adaptability, and domain fit.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:border-purple-300 transition hover:shadow-lg">
            <h5 className="text-lg font-bold text-purple-700 mb-2 font-['Inter']">2. Readiness Engine</h5>
            <p className="text-slate-700 font-['Inter']">
              We validate if someone is truly deployable — not just teachable.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200 hover:border-cyan-300 transition hover:shadow-lg">
            <h5 className="text-lg font-bold text-cyan-700 mb-2 font-['Inter']">3. Capability Building</h5>
            <p className="text-slate-700 font-['Inter']">
              We guide learners through sprint-based, outcome-driven journeys.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 hover:border-orange-300 transition hover:shadow-lg">
            <h5 className="text-lg font-bold text-orange-700 mb-2 font-['Inter']">4. Access Layer</h5>
            <p className="text-slate-700 font-['Inter']">
              We connect them to employers, startups, and social missions — with confidence.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Page;
