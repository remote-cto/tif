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
              Let's Talk
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full shadow-lg"></div>
          </div>

          {/* Main content in elevated card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 md:p-12 shadow-2xl shadow-blue-100/50">
            {/* Opening section */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-6 font-['Inter']">
                You're Not Here by Accident
              </h2>
              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                If you're reading this, it means you believe talent should be{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-['Inter']">
                  measured better
                </span>
                ,{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 font-['Inter']">
                  trained smarter
                </span>
                , and{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 font-['Inter']">
                  connected faster
                </span>
                .
              </p>
            </div>

            {/* Partners section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-slate-700 mb-8 text-center font-['Inter']">
                We're looking to work with:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* College partners card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <p className="text-lg font-bold text-blue-700 font-['Inter']">
                      Colleges
                    </p>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    That want to be{" "}
                    <span className="font-bold text-blue-700 font-['Inter']">regional AI-first hubs</span>
                  </p>
                </div>

                {/* Corporate partners card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <p className="text-lg font-bold text-purple-700 font-['Inter']">
                      Corporates
                    </p>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    Ready to hire for skill, not just pedigree
                  </p>
                </div>

                {/* CSR leaders card */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50 hover:border-cyan-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <p className="text-lg font-bold text-cyan-700 font-['Inter']">
                      CSR Leaders
                    </p>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    Who want their money to create{" "}
                    <span className="font-bold text-cyan-700 font-['Inter']">long-term skill equity</span>
                  </p>
                </div>

                {/* Government partners card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 hover:border-green-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-green-100/50">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <p className="text-lg font-bold text-green-700 font-['Inter']">
                      Government Partners
                    </p>
                  </div>
                  <p className="text-slate-700 font-['Inter']">
                    Or ecosystem partners building for{" "}
                    <span className="font-bold text-green-700 font-['Inter']">GenAI-readiness</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy section */}
            <div className="relative mb-12">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-sm"></div>
              <div className="pl-8 py-6 bg-gradient-to-r from-orange-50/70 to-red-50/70 rounded-2xl border-l-4 border-orange-400 shadow-sm">
                <div className="space-y-4">
                  <p className="text-xl text-slate-700 font-semibold font-['Inter']">
                    We don't cold-sell.
                  </p>
                  <p className="text-xl text-slate-700 font-semibold font-['Inter']">
                    We align deeply.
                  </p>
                  <p className="text-xl text-slate-700 font-semibold font-['Inter']">
                    And when we build, we build{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-['Inter']">
                      quietly, but powerfully.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center mb-8">
              <p className="text-xl text-slate-700 mb-6 font-['Inter']">
                Let's talk — and let's co-create something India hasn't seen yet.
              </p>
            </div>

            {/* Contact information */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200/50">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">📧</span>
                  </div>
                  <a 
                    href="mailto:hello@xworks.live" 
                    className="text-lg font-semibold text-blue-700 hover:text-blue-800 transition-colors font-['Inter']"
                  >
                    hello@xworks.live
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">📞</span>
                  </div>
                  <span className="text-lg font-semibold text-purple-700 font-['Inter']">
                    +91-XXXXXXXXXX
                  </span>
                </div>
              </div>
            </div>

            {/* Closing line with emphasis - Added to match Mapping Talent page */}
            <div className="text-center pt-8 border-t border-slate-200/50">
              <p className="text-xl text-slate-600 font-semibold font-['Inter']">
                Ready to transform how talent is discovered and developed?
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