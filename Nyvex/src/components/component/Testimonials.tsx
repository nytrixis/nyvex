"use client";

import React from "react";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "NyveX has completely transformed how we connect with investors. We secured our seed funding in just 3 weeks!",
      name: "Sarah Johnson",
      title: "Founder, NeuralLink AI"
    },
    {
      quote: "The transparency and security offered by NyveX gave us confidence to invest in early-stage startups we might have otherwise overlooked.",
      name: "Michael Chen",
      title: "Angel Investor"
    },
    {
      quote: "As a first-time founder, navigating venture funding seemed impossible until I found NyveX. Their platform made the process seamless.",
      name: "Aisha Patel",
      title: "CEO, GreenSolar"
    },
    {
      quote: "The video pitch feature allowed us to truly showcase our vision in ways a traditional pitch deck never could.",
      name: "David Rodriguez",
      title: "CTO, MediScan"
    },
    {
      quote: "We've invested in 5 startups through NyveX and have seen an average ROI of 32% - the platform's analytics tools are game-changing.",
      name: "Jennifer Wu",
      title: "Investment Director, Horizon Ventures"
    },
    {
      quote: "The KYC process was refreshingly straightforward. NyveX has found the perfect balance between security and user experience.",
      name: "Thomas Müller",
      title: "Founder, EduTech Solutions"
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-[#1a2942] to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-[#00E6E6] blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-[#00E6E6] blur-3xl"></div>
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
            Success <span className="text-[#00E6E6]">Stories</span>
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "150px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-1 bg-[#00E6E6] mx-auto rounded-full"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto mt-6 font-light"
          >
            Hear from founders and investors who have experienced the Venturâ difference
          </motion.p>
        </motion.div>
        
        {/* Testimonials carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="py-4"
          />
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { number: "94%", label: "Funding Success Rate" },
            { number: "$30K+", label: "Total Funds Raised" },
            { number: "100+", label: "Startups Launched" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="text-center p-6 rounded-xl bg-slate-800/50 shadow-lg border border-slate-700 hover:shadow-[0_0_20px_rgba(0,230,230,0.2)] transition-all duration-300"
            >
              <div className="text-4xl font-bold text-[#00E6E6] mb-2">{stat.number}</div>
              <div className="text-slate-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
          
      </div>
      {/* Decorative bottom wave */}
      <motion.div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
  <svg 
    className="relative block w-full h-12" 
    data-name="Layer 1" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 1200 120" 
    preserveAspectRatio="none"
  >
    <path 
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,156.63,69.08,321.39,56.44Z" 
      className="fill-slate-900"
    ></path>
  </svg>
</motion.div>
    </div>
  );
};

export default Testimonials;
