"use client";
import React, { useState } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full z-40 transition-all duration-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <Image
                src="/images/XWORKS.png"
                alt="XWORKS Logo"
                width={148}
                height={148}
                className="text-white w-[70px] h-[48px] md:w-[150px] md:h-[100px]"
              />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/model"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                The Model
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/mappingtalent"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                Mapping Talent
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/readiness"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                Readiness
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/capability"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                Capability Building
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/access"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                Access
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="relative text-slate-800 hover:text-slate-900 transition-colors duration-300 group font-semibold text-lg"
              >
                Let's Talk
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <div className="flex items-center space-x-3">
                <Link href="/Login">
                  <button className="flex items-center border-2 border-slate-300 text-slate-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </button>
                </Link>
                <Link href="/Register">
                  <button className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </button>
                </Link>
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-lg z-30 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <Link
              href="/"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/model"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              The Model
            </Link>
            <Link
              href="/mappingtalent"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Mapping Talent
            </Link>
            <Link
              href="/readiness"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Readiness
            </Link>
            <Link
              href="/capability"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Capability Building
            </Link>
            <Link
              href="/access"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Access
            </Link>

            <Link
              href="/contact"
              className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Let's Talk
            </Link>

            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <Link href="/Login">
                <button className="flex items-center justify-center border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </button>
              </Link>
              <Link href="/Register">
                <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg transform hover:scale-105 transition-all active:scale-95">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
