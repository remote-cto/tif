import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Image from "next/image";

const Page = () => {
  return (
    <>
      <Navbar />

      <section className="pt-4 md:pt-14 bg-gradient-to-br from-slate-50 via-white to-green-50 font-['Inter']">
        {/* Hero Section */}
        <div className="relative py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <p className="text-xl text-slate-700 leading-relaxed">
                Not all access is granted. Some is earned.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed">
                We map hidden potential to high-opportunity zones. Through
                intelligent match layers, algorithmic fitment, and behavioral edge
                detection, our platform opens portals — not gates.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed">
                Whether you’re an institution, a learner, or a hiring partner —
                what you gain access to isn’t just a dashboard. It’s a living
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

          {/* Section Cards */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3">
                🟩 Opportunity Layers
              </h3>
              <p className="text-slate-700">
                We don’t match talent to jobs. We match potential to possibility —
                through role-AI fit modeling.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3">
                🟩 Gateways, Not Walls
              </h3>
              <p className="text-slate-700">
                We open personalized access paths for learners, institutions, and
                employers based on authentic signal.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-blue-700 font-semibold text-xl mb-3">
                🟩 Dynamic Fit Graph
              </h3>
              <p className="text-slate-700">
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
