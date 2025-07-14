import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Page = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden font-['Inter']">
      <Navbar/>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-cyan-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.4) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative z-10 py-10 px-6 md:px-16 lg:px-24 mt-15">
        <div className="max-w-5xl mx-auto">
          {/* Heading with modern styling */}
          <div className="text-center mb-3">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
              The Model
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full shadow-lg"></div>

            {/* Subheading */}
            <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mb-12 font-['Inter']">
              The Intelligence Layer Beneath Talent
            </h3>
          </div>

          {/* Main content in elevated card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 md:p-12 shadow-2xl shadow-blue-100/50">
            {/* Opening paragraphs */}
            <div className="space-y-6 mb-10">
              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                At XWORKS, we don't run programs — we run a{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-['Inter']">
                  Talent Intelligence Framework
                </span>
                .
              </p>

              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                This framework is our model — a living, evolving system that maps potential, validates readiness, builds real capability, and opens access to opportunities that matter.
              </p>
            </div>

            {/* Four Core Layers */}
            <div className="mb-10">
              <h4 className="text-2xl font-bold text-slate-800 mb-8 text-center font-['Inter']">
                It works across four core layers:
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Layer 1: Mapping Talent */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 group-hover:animate-pulse shadow-sm">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h5 className="text-lg font-bold text-blue-700 font-['Inter']">
                      Mapping Talent
                    </h5>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    We identify signals of ability, adaptability, and domain fit.
                  </p>
                </div>

                {/* Layer 2: Readiness Engine */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 group-hover:animate-pulse shadow-sm">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h5 className="text-lg font-bold text-purple-700 font-['Inter']">
                      Readiness Engine
                    </h5>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    We validate if someone is truly deployable — not just teachable.
                  </p>
                </div>

                {/* Layer 3: Capability Building */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200/50 hover:border-cyan-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:animate-pulse shadow-sm">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h5 className="text-lg font-bold text-cyan-700 font-['Inter']">
                      Capability Building
                    </h5>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    We guide learners through sprint-based, outcome-driven journeys.
                  </p>
                </div>

                {/* Layer 4: Access Layer */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200/50 hover:border-orange-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-orange-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4 group-hover:animate-pulse shadow-sm">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <h5 className="text-lg font-bold text-orange-700 font-['Inter']">
                      Access Layer
                    </h5>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    We connect them to employers, startups, and social missions — with confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Impact section */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200/50 mb-10">
              <h4 className="text-xl font-bold text-emerald-700 mb-6 font-['Inter']">
                This model enables:
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                  <p className="text-slate-700 font-['Inter']">
                    Institutions become{" "}
                    <span className="font-bold text-emerald-700 font-['Inter']">AI-first talent hubs</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                  <p className="text-slate-700 font-['Inter']">
                    Companies find{" "}
                    <span className="font-bold text-emerald-700 font-['Inter']">signals beyond scores</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced blockquote */}
            <div className="relative mb-10">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
              <blockquote className="pl-8 py-6 bg-gradient-to-r from-cyan-50/70 to-blue-50/70 rounded-2xl border-l-4 border-cyan-400 shadow-sm">
                <p className="text-2xl text-slate-700 italic leading-relaxed mb-4 font-medium font-['Inter']">
                  It's not a funnel. It's an ecosystem —
                </p>
                <p className="text-2xl text-slate-700 italic leading-relaxed font-medium font-['Inter']">
                  and it's working quietly behind India's next wave of talent.
                </p>
              </blockquote>
            </div>

            {/* Closing line with emphasis */}
            <div className="text-center pt-8 border-t border-slate-200/50">
              <p className="text-xl text-slate-600 font-semibold font-['Inter']">
                This model is the foundation of every activation we run.
              </p>
            </div>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute top-32 right-10 w-6 h-6 bg-blue-400 rounded-full opacity-20 animate-bounce delay-300"></div>
          <div className="absolute bottom-40 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-20 animate-bounce delay-700"></div>
          <div className="absolute top-1/2 right-20 w-8 h-8 bg-cyan-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default Page;