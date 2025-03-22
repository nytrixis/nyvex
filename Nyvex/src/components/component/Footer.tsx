import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Github, ArrowUpRight } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-[#0a1525] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none dark:opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#00E6E6] blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#00E6E6] blur-3xl"></div>
      </div>
      
      {/* Main footer content */}
      <div className="container relative z-10 mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand section */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                NYVE
              </h2>
              <Image
                src="/images/cross-chain.png"
                alt="X"
                width={40}
                height={40}
                className="ml-1"
              />
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 max-w-md">
              Empowering startups through blockchain innovation. Secure, transparent funding on the Avalanche network.
            </p>
            
            <div className="pt-2">
              <div className="flex space-x-5">
                {[
                  { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com" },
                  { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com" },
                  { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com" },
                  { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com" },
                  { icon: <Github className="h-5 w-5" />, href: "https://github.com" }
                ].map((social, index) => (
                  <Link 
                    key={index} 
                    href={social.href} 
                    className="bg-white dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-[#00E6E6] dark:hover:text-[#00E6E6] hover:shadow-md transition-all duration-300"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick links section */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white relative inline-block">
              Platform
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#00E6E6]"></span>
            </h3>
            <ul className="space-y-3">
              {["Home", "Startups", "Investors", "About", "Contact"].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`} 
                    className="text-slate-600 dark:text-slate-300 hover:text-[#00E6E6] dark:hover:text-[#00E6E6] transition-colors flex items-center"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources section */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white relative inline-block">
              Resources
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#00E6E6]"></span>
            </h3>
            <ul className="space-y-3">
              {["Documentation", "Whitepaper", "API", "Tutorials", "Blog"].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={`/${item.toLowerCase()}`} 
                    className="text-slate-600 dark:text-slate-300 hover:text-[#00E6E6] dark:hover:text-[#00E6E6] transition-colors flex items-center"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal section */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#00E6E6]"></span>
            </h3>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimers"].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-slate-600 dark:text-slate-300 hover:text-[#00E6E6] dark:hover:text-[#00E6E6] transition-colors flex items-center"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter section */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white relative inline-block">
              Stay Updated
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#00E6E6]"></span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Subscribe to our newsletter for the latest updates
            </p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00E6E6] text-sm"
              />
              <button className="px-4 py-2 bg-[#00E6E6] text-slate-900 rounded-md text-sm font-medium hover:bg-[#00E6E6]/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} NYVEX. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-xs px-3 py-1 rounded-full bg-[#00E6E6]/10 text-[#00E6E6] border border-[#00E6E6]/20">
              Powered by Avalanche
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
