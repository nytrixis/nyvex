import React from "react";
import { Stats } from "@/components/component/stats";
import { motion } from "framer-motion";

const Statsection = () => {
  return (
    <div className="py-24 bg-gradient-to-r from-slate-900 via-[#0a1525] to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#00E6E6] blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-[#00E6E6] blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with animated underline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          <motion.h2 
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-white inline-block"
          >
            Platform <span className="text-[#00E6E6]">Stats</span>
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-1 bg-[#00E6E6] mx-auto rounded-full"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto mt-6 font-light"
          >
            Discover our platform's growth and impact through real-time metrics
          </motion.p>
        </motion.div>
        
        {/* Stats cards with hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10"
        >
          <div className="backdrop-blur-sm bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#00E6E6]/10 rounded-full blur-2xl"></div>
            <Stats />
          </div>
        </motion.div>
        
        {/* Additional feature highlight */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-2 rounded-full bg-[#00E6E6]/10 border border-[#00E6E6]/20 text-[#00E6E6] font-medium">
            Powered by Avalanche Blockchain
          </div>
        </motion.div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-12" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,156.63,69.08,321.39,56.44Z" 
            className="fill-[#1a2942]"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Statsection;
