"use client";
import React, { useEffect, useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
// Import the new TypewriterEffectBackspace component
import { TypewriterEffectBackspace } from "@/components/ui/typewriter-effect";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import Statsection from "@/components/component/Statsection";
import DashboardPreview from "@/components/component/DashboardPreview";
import Testimonials from "@/components/component/Testimonials";
import Footer from "@/components/component/Footer";
import { useStateContext } from "@/context";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";


// Define the type for the campaign data
interface Campaign {
  title: string;
  description: string;
  image: string;
}

const Home: React.FC = () => {
  const { getCampaigns } = useStateContext();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaignData = await getCampaigns();
      setCampaigns(campaignData);
    };
    fetchCampaigns();
  }, [getCampaigns]);

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Hero Section with Background Boxes */}
      <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
        {/* Background mask for better text visibility */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none opacity-60" />
        
        {/* Background boxes */}
        <Boxes />
        
        {/* Hero content */}
        <div className="container mx-auto flex flex-col justify-center items-center relative z-30">
          <div className="flex items-center">
            <h1 className="text-6xl md:text-8xl font-bold text-center mb-4 font-montserrat" style={{ color: '#00E6E6' }}>
              NYVE
            </h1>
            <Image
              src="/images/cross-chain.png"
              alt="X"
              width={100}
              height={100}
              className="mb-4 ml-2"
            />
          </div>
          <div className="flex flex-col items-center mt-8">
  <div className="relative">
    <h2 className="text-6xl md:text-6xl font-bold text-white font-montserrat mb-2 text-center">
      <span className="relative">
        <span className="relative z-10">Invest in the</span>
        {/* <span className="absolute -bottom-3 left-0 w-full h-3 bg-[#00E6E6]/20 rounded-full blur-sm"></span> */}
      </span>
    </h2>
    
    <div className="flex items-center justify-center mt-2 mb-6">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 rounded-lg border border-slate-700/50 shadow-xl mt-3">
        <TypewriterEffectBackspace
          words={["Future", "Innovation", "Web3", "Blockchain", "AVAX"]}
          className="text-3xl md:text-3xl font-bold font-montserrat text-[#00E6E6]"
          cursorClassName="bg-[#00E6E6] w-1 h-10 ml-1"
          typingSpeed={120}
          backspaceSpeed={80}
          delayBetweenWords={1500}
        />
      </div>
    </div>
  </div>
  
  <div className="flex flex-wrap justify-center gap-4 mt-4 max-w-2xl">
    <div className="bg-slate-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50 flex items-center">
      <span className="w-2 h-2 bg-[#00E6E6] rounded-full mr-2 animate-pulse"></span>
      <span className="text-white font-medium">Secure Investments</span>
    </div>
    <div className="bg-slate-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50 flex items-center">
      <span className="w-2 h-2 bg-[#00E6E6] rounded-full mr-2 animate-pulse"></span>
      <span className="text-white font-medium">Blockchain Powered</span>
    </div>
    <div className="bg-slate-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50 flex items-center">
      <span className="w-2 h-2 bg-[#00E6E6] rounded-full mr-2 animate-pulse"></span>
      <span className="text-white font-medium">Avalanche Network</span>
    </div>
  </div>
</div>

        </div>
      </div>

      {/* Investor Dashboard Preview Section */}
      <DashboardPreview />

      {/* Stats Section */}
      <Statsection />

      {/* Recommended Startups Section */}
      <div className="py-24 pb-32 bg-gradient-to-r from-slate-900 via-[#0a1525] to-slate-900 relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
    <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-[#00E6E6] blur-3xl"></div>
    <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-[#00E6E6] blur-3xl"></div>
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
        Trending <span className="text-[#00E6E6]">Startups</span>
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
        Discover innovative projects with high growth potential on the Avalanche blockchain
      </motion.p>
    </motion.div>
    
    {/* Startup cards with 3D hover effects */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative z-10"
    >
      <div className="backdrop-blur-sm bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50 shadow-xl min-h-[600px]">
        <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#00E6E6]/10 rounded-full blur-2xl"></div>
        
        {/* Cards container */}
        <div className="flex flex-wrap gap-6 justify-center">
          {campaigns
            .filter((_, index) => index !== 2)
            .slice(0, 4)
            .map((campaign, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <CardContainer className="inter-var">
                  <CardBody className="relative group/card bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-white/10 w-[300px] h-[420px] rounded-xl p-6 hover:border-[#00E6E6]/30 hover:shadow-[0_0_25px_rgba(0,230,230,0.15)] transition-all duration-300">
                    {/* Image */}
                    <CardItem translateZ="100" className="w-full h-44 mb-4 relative">
                      <div className="w-full h-full overflow-hidden rounded-lg">
                        <Image
                          src={campaign.image}
                          height="1000"
                          width="1000"
                          className="h-full w-full object-cover rounded-lg group-hover/card:shadow-xl transition-all duration-300 hover:scale-105"
                          alt={campaign.title}
                        />
                      </div>
                      
                      {/* Category tag - moved on top of the image */}
                      <div className="absolute top-3 right-3 z-10">
                        <CardItem
                          translateZ="120"
                          className="px-3 py-1 bg-[#00E6E6]/20 backdrop-blur-md rounded-full text-xs font-medium text-[#00E6E6] border border-[#00E6E6]/20"
                        >
                          {index % 2 === 0 ? "DeFi" : "GameFi"}
                        </CardItem>
                      </div>
                    </CardItem>
                    
                    {/* Content */}
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-white mb-2"
                    >
                      {campaign.title}
                    </CardItem>
                    
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-slate-300 text-sm h-[60px] overflow-hidden"
                    >
                      {campaign.description.substring(0, 80)}...
                    </CardItem>
                    
                    {/* Stats */}
                    <CardItem translateZ="70" className="w-full mt-2">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Raised</p>
                          <p className="text-white font-medium">${(Math.random() * 500000).toFixed(0)}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Target</p>
                          <p className="text-white font-medium">${(Math.random() * 1000000 + 500000).toFixed(0)}</p>
                        </div>
                      </div>
                    </CardItem>
                    
                    {/* Progress bar */}
                    <CardItem translateZ="50" className="w-full">
                      <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00E6E6] to-[#00E6E6]/70 rounded-full"
                          style={{ width: `${30 + Math.random() * 60}%` }}
                        />
                      </div>
                    </CardItem>
                    
                    {/* Button with 10px top margin */}
                    <CardItem translateZ="90" className="w-full mt-10">
                      <button className="w-full py-2 bg-[#00E6E6] text-slate-900 rounded-md text-sm font-medium hover:bg-[#00E6E6]/90 transition-colors">
                        View Details
                      </button>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
    
    {/* View all projects button */}
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1 }}
      className="mt-12 text-center"
    >
      <Link href="/startups" prefetch={false}>
        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#00E6E6]/20 to-[#00E6E6]/10 border border-[#00E6E6]/20 text-[#00E6E6] font-medium hover:from-[#00E6E6]/30 hover:to-[#00E6E6]/20 transition-all duration-300">
          Explore All Startups
        </button>
      </Link>
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

<Testimonials />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;
