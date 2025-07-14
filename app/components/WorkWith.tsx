"use client";
import React from "react";
import { Sparkles } from "lucide-react";

const WorkWith = () => {
  return (
    <section className=" bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden font-[Inter]">
      {/* Background Elements */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 mt-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
            Who We Work With
          </h2>

          <p className="text-base md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-4">
            We're in quiet partnership with colleges, business, and policy-level
            stakeholders who see what's coming — and want to be ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center text-base md:text-xl font-medium">
            <div className="flex items-center text-slate-700">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-1"></div>
              We don't advertise our collaborators.
            </div>
            <div className="flex items-center text-slate-700">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-1 ml-3"></div>
              They become evident by their results.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkWith;
