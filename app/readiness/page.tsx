import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Image from "next/image";

const Page = () => {
  return (
    <>
      <Navbar />

      <section className="pt-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 font-['Inter']">
        {/* Hero Section */}
        <div className="relative py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <p className="text-xl text-slate-700 leading-relaxed">
                Every individual emits signals — patterns of skill, pace, and
                potential. Most systems miss them.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed">
                At <span className="font-bold text-blue-600">XWORKS</span>,
                readiness is not a score. It’s a multi-dimensional alignment — of
                cognition, adaptability, and industry signal resonance. We don’t
                just measure talent. We tune into it.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed">
                Behind the radar lies a proprietary readiness engine — trained on
                future-of-work indicators, calibrated with employer thresholds,
                and constantly learning from behavioral flux. What you see is just
                the surface.
              </p>
            </div>

            {/* Image */}
            <div className="flex-1">
              <Image
                src="/images/Readiness.jpg"
                alt="Readiness Engine Illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-md object-cover"
              />
            </div>
          </div>

          {/* Section Cards */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3">
                🟦 Signal Mapping
              </h3>
              <p className="text-slate-700">
                We capture micro-patterns often lost in traditional assessments —
                to uncover latent potential.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3">
                🟦 Alignment Engine
              </h3>
              <p className="text-slate-700">
                Our readiness model adapts to evolving industry thresholds — not
                yesterday’s benchmarks.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3">
                🟦 Beyond Scores
              </h3>
              <p className="text-slate-700">
                Readiness is not just measured. It’s interpreted, calibrated, and
                forecasted — in real-time.
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
