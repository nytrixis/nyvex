import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  Activity, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const tabs = [
    
    { name: "Portfolio", icon: <Wallet className="w-4 h-4" /> },
    { name: "Analytics", icon: <LineChart className="w-4 h-4" /> },
    { name: "Overview", icon: <Activity className="w-4 h-4" /> }
  ];
  
  const slides = [
    {
      title: "Investment Portfolio",
      description: "Track all your investments and NFT certificates in one place with real-time updates.",
      image: "overview"
    },
    {
      title: "Startup Milestones",
      description: "Monitor progress of your funded startups through interactive milestone trackers.",
      image: "analytics"
    },
    {
      title: "Loan Management",
      description: "Manage your loans with detailed repayment schedules and document verification.",
      image: "discovery"
    }
  ];
  
  
  return (
    <div className="py-24 bg-gradient-to-r from-slate-900 via-[#0a1525] to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#00E6E6] blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-[#00E6E6] blur-3xl"></div>
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
            Investor <span className="text-[#00E6E6]">Dashboard</span>
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
            Powerful tools to track, analyze, and optimize your startup investments
          </motion.p>
        </motion.div>
        
        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="backdrop-blur-sm bg-slate-800/30 rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#00E6E6]/10 rounded-full blur-2xl"></div>
            
            {/* Browser-like mockup */}
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
              {/* Browser header */}
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-slate-700 rounded-full px-4 py-1 text-xs text-slate-300 max-w-xs">
                  app.nyvex.io/dashboard
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-6">
                {/* Dashboard tabs */}
                <div className="flex border-b border-slate-700 mb-6">
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === index 
                          ? "text-[#00E6E6] border-b-2 border-[#00E6E6]" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab.icon}
                      <span className="ml-2">{tab.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* Dashboard carousel */}
                <div className="relative overflow-hidden rounded-lg" style={{ height: "400px" }}>
                  {/* Slides */}
                  <div 
                    className="flex transition-transform duration-500 h-full"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div key={index} className="min-w-full h-full flex flex-col md:flex-row items-center gap-8 p-4">
                        {/* Content */}
                        <div className="md:w-1/3">
                          <h3 className="text-2xl font-bold text-white mb-4">{slide.title}</h3>
                          <p className="text-slate-300 mb-6">{slide.description}</p>
                          <button className="px-4 py-2 bg-[#00E6E6] text-slate-900 rounded-md text-sm font-medium hover:bg-[#00E6E6]/90 transition-colors flex items-center">
                            Explore Feature
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Mockup visualization */}
                        <div className="md:w-2/3 h-full bg-slate-800/50 rounded-xl border border-slate-700 p-4 relative overflow-hidden">
                          {slide.image === "overview" && (
                            <OverviewDashboard />
                          )}
                          {slide.image === "analytics" && (
                            <AnalyticsDashboard />
                          )}
                          {slide.image === "discovery" && (
                            <DiscoveryDashboard />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation arrows */}
                  <button 
                    onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800/70 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800/70 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          activeSlide === index ? "bg-[#00E6E6]" : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature highlights */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
  {[
    {
      icon: <Wallet className="h-5 w-5 text-[#00E6E6]" />,
      title: "NFT Certificates",
      description: "Receive NFT certificates as proof of your investments in startups."
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-[#00E6E6]" />,
      title: "Milestone Tracking",
      description: "Monitor startup progress through interactive milestone trackers."
    },
    {
      icon: <Activity className="h-5 w-5 text-[#00E6E6]" />,
      title: "Document Verification",
      description: "Access and verify all startup and loan documents securely on IPFS."
    }
  ].map((feature, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 hover:border-[#00E6E6]/30 transition-colors"
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="flex items-start">
        <div className="bg-slate-700 rounded-lg p-3 mr-4">
          {feature.icon}
        </div>
        <div>
          <h3 className="text-white font-medium mb-2">{feature.title}</h3>
          <p className="text-slate-300 text-sm">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  ))}
</div>

          </div>
        </motion.div>
        
        {/* CTA button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#00E6E6]/20 to-[#00E6E6]/10 border border-[#00E6E6]/20 text-[#00E6E6] font-medium hover:from-[#00E6E6]/30 hover:to-[#00E6E6]/20 transition-all duration-300">
            Request Early Access
          </button>
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
            className="fill-white dark:fill-slate-900"
          ></path>
        </svg>
      </div>
    </div>
  );
};

// Dashboard mockup components
const OverviewDashboard = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Portfolio Overview</h4>
        <div className="bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded">Last updated: Just now</div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Invested", value: "$125,400" },
          { label: "Current Value", value: "$183,750" },
          { label: "Total ROI", value: "+46.5%" }
        ].map((stat, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className={`text-sm font-medium ${index === 2 ? "text-green-400" : "text-white"}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* NFT Certificates Section - NEW */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
        <h5 className="text-xs text-slate-400 mb-3">Investment Certificates</h5>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-700/50 p-2 rounded-lg border border-slate-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#00E6E6] text-xs text-black px-1.5 py-0.5 rounded-bl-md">
                #{i}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[#00E6E6] text-xs">
                  {String.fromCharCode(64 + i)}
                </div>
                <p className="text-xs text-white truncate">TechVision AI</p>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">10 AVAX</span>
                <span className="text-[#00E6E6]">2.5% Equity</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-grow bg-slate-700/30 rounded-lg p-4 relative">
        <h5 className="text-xs text-slate-400 mb-3">Portfolio Performance</h5>
        
        {/* Mock chart */}
        <div className="h-[140px] flex items-end space-x-1">
          {[35, 42, 38, 45, 40, 48, 55, 60, 58, 65, 70, 68].map((height, index) => (
            <div 
              key={index} 
              className="flex-1 bg-gradient-to-t from-[#00E6E6]/40 to-[#00E6E6]/80 rounded-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
            <div key={index} className="text-[10px] text-slate-500">
              {month}
            </div>
          ))}
        </div>
      </div>
      
      {/* Investments */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-xs text-slate-400">Top Investments</h5>
          <button className="text-[10px] text-[#00E6E6]">View All</button>
        </div>
        
        <div className="space-y-2">
          {[
            { name: "TechVision AI", amount: "$45,000", roi: "+28.5%", status: "active" },
            { name: "GreenEnergy Solutions", amount: "$30,000", roi: "+52.3%", status: "active" },
            { name: "MedTech Innovations", amount: "$25,000", roi: "+18.7%", status: "active" }
          ].map((investment, index) => (
            <div key={index} className="bg-slate-700/30 rounded-lg p-2 flex justify-between items-center">
              <div>
                <p className="text-xs text-white">{investment.name}</p>
                <p className="text-[10px] text-slate-400">{investment.amount}</p>
              </div>
              <div className="text-xs text-green-400">{investment.roi}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Investment Analytics</h4>
        <div className="flex space-x-2">
          <button className="bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded">Monthly</button>
          <button className="bg-[#00E6E6]/20 text-xs text-[#00E6E6] px-2 py-1 rounded">Yearly</button>
        </div>
      </div>
     
      {/* Main chart */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xs text-slate-400">ROI by Sector</h5>
          <div className="flex space-x-3">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#00E6E6] mr-1"></div>
              <span className="text-[10px] text-slate-400">Tech</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-1"></div>
              <span className="text-[10px] text-slate-400">Health</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div>
              <span className="text-[10px] text-slate-400">Energy</span>
            </div>
          </div>
        </div>
       
        {/* Mock line chart */}
        <div className="h-[140px] relative">
          {/* Tech line */}
          <svg className="absolute inset-0 h-full w-full">
            <path
              d="M0,120 C20,100 40,110 60,90 C80,70 100,80 120,60 C140,40 160,50 180,30 C200,20 220,10 240,5"
              fill="none"
              stroke="#00E6E6"
              strokeWidth="2"
            />
          </svg>
         
          {/* Health line */}
          <svg className="absolute inset-0 h-full w-full">
            <path
              d="M0,140 C20,130 40,120 60,125 C80,130 100,110 120,100 C140,90 160,85 180,70 C200,60 220,50 240,45"
              fill="none"
              stroke="rgb(192, 132, 252)"
              strokeWidth="2"
            />
          </svg>
         
          {/* Energy line */}
          <svg className="absolute inset-0 h-full w-full">
            <path
              d="M0,150 C20,145 40,140 60,130 C80,120 100,115 120,110 C140,105 160,90 180,85 C200,80 220,70 240,60"
              fill="none"
              stroke="rgb(251, 191, 36)"
              strokeWidth="2"
            />
          </svg>
         
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-rows-4 h-full w-full">
            {[0, 1, 2, 3].map((_, index) => (
              <div key={index} className="border-t border-slate-700/50 flex items-center">
                <span className="text-[10px] text-slate-500 absolute -left-6">
                  {(40 - index * 10)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Section - NEW */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-xs text-slate-400">Startup Milestones</h5>
          <button className="text-[10px] text-[#00E6E6]">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { name: "TechVision AI", milestone: "MVP Launch", progress: 100, date: "Completed", color: "bg-green-400" },
            { name: "GreenEnergy", milestone: "Prototype Testing", progress: 60, date: "In Progress", color: "bg-[#00E6E6]" },
            { name: "MedTech Solutions", milestone: "Seed Funding", progress: 30, date: "In Progress", color: "bg-[#00E6E6]" }
          ].map((item, index) => (
            <div key={index} className="bg-slate-700/50 p-2 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#00E6E6]' : index === 1 ? 'bg-purple-400' : 'bg-amber-400'} mr-2`}></div>
                  <p className="text-xs text-white">{item.name}: <span className="text-slate-300">{item.milestone}</span></p>
                </div>
                <span className={`text-[10px] ${item.progress === 100 ? 'text-green-400' : 'text-slate-400'}`}>{item.date}</span>
              </div>
              <div className="w-full bg-slate-600 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color}`} 
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
     
      {/* Bottom charts */}
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {/* Pie chart */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h5 className="text-xs text-slate-400 mb-2">Portfolio Allocation</h5>
          <div className="flex items-center justify-center h-[100px] relative">
            {/* Mock pie chart */}
            <div className="w-20 h-20 rounded-full border-6 border-[#00E6E6] relative">
              <div className="absolute inset-0 border-6 border-transparent border-t-purple-400 border-r-purple-400 rounded-full transform rotate-45"></div>
              <div className="absolute inset-0 border-6 border-transparent border-b-amber-400 rounded-full transform rotate-45"></div>
            </div>
           
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-white font-medium">$183.7K</span>
            </div>
          </div>
         
          {/* Legend */}
          <div className="grid grid-cols-3 gap-1 mt-2">
            {[
              { color: "bg-[#00E6E6]", label: "Tech", value: "45%" },
              { color: "bg-purple-400", label: "Health", value: "30%" },
              { color: "bg-amber-400", label: "Energy", value: "25%" }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${item.color} mr-1`}></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{item.label}</span>
                  <span className="text-[10px] text-white">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
       
        {/* Bar chart */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h5 className="text-xs text-slate-400 mb-2">Monthly Returns</h5>
          <div className="h-[100px] flex items-end justify-between px-2">
            {[15, 22, -5, 18, 10, 25].map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-5 ${value >= 0 ? 'bg-green-400' : 'bg-red-400'} rounded-sm`}
                  style={{ height: `${Math.abs(value) * 2.5}px` }}
                ></div>
                <span className="text-[10px] text-slate-400 mt-1">
                  {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
         
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-white">
              <span className="text-green-400">+14.2%</span> avg. monthly return
            </div>
            <button className="text-[10px] text-[#00E6E6]">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};


const DiscoveryDashboard = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header with search */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Startup Discovery</h4>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search startups..." 
            className="bg-slate-700 text-xs text-white px-3 py-1 rounded-full w-40 focus:outline-none focus:ring-1 focus:ring-[#00E6E6]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 px-1 flex-wrap">
        {["All Startups", "Tech", "Health", "Energy", "Finance", "Education"].map((filter, index) => (
          <button 
            key={index} 
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
              index === 0 
                ? "bg-[#00E6E6] text-slate-900" 
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Startup cards */}
      <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-2 flex-grow">
        {[
          { 
            name: "NeuralLink AI", 
            category: "Tech", 
            raised: "$1.2M", 
            target: "$2M",
            progress: 60,
            logo: "N"
          },
          { 
            name: "GreenSolar", 
            category: "Energy", 
            raised: "$850K", 
            target: "$1M",
            progress: 85,
            logo: "G"
          },
          { 
            name: "MediScan", 
            category: "Health", 
            raised: "$650K", 
            target: "$1.5M",
            progress: 43,
            logo: "M"
          },
          { 
            name: "EduTech", 
            category: "Education", 
            raised: "$420K", 
            target: "$750K",
            progress: 56,
            logo: "E"
          }
        ].map((startup, index) => (
          <div key={index} className="bg-slate-700/40 rounded-lg p-3 flex flex-col">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-[#00E6E6] font-medium text-sm mr-2">
                {startup.logo}
              </div>
              <div>
                <h5 className="text-xs text-white">{startup.name}</h5>
                <span className="text-[10px] text-slate-400">{startup.category}</span>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Raised: <span className="text-white">{startup.raised}</span></span>
                <span className="text-slate-400">Target: <span className="text-white">{startup.target}</span></span>
              </div>
              
              <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00E6E6]" 
                  style={{ width: `${startup.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-white">{startup.progress}%</span>
                <button className="text-[10px] bg-slate-600 hover:bg-slate-500 text-white px-2 py-0.5 rounded">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recommendation section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-xs text-slate-400">Recommended for You</h5>
          <button className="text-[10px] text-[#00E6E6]">View All</button>
        </div>
        
        <div className="bg-slate-700/40 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-[#00E6E6] font-medium mr-3">
              Q
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h5 className="text-xs text-white">QuantumCompute</h5>
                <span className="text-[10px] bg-[#00E6E6]/20 text-[#00E6E6] px-2 py-0.5 rounded-full">
                  98% Match
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Developing next-gen quantum computing solutions for enterprise applications
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-slate-400">
                  <span className="text-white">$1.8M</span> raised of $3M
                </span>
                <button className="text-[10px] bg-[#00E6E6] text-slate-900 px-2 py-0.5 rounded hover:bg-[#00E6E6]/90">
                  Invest Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loan Management Section - NEW */}
<div className="mt-4">
  <div className="flex justify-between items-center mb-2">
    <h5 className="text-xs text-slate-400">Active Loans</h5>
    <button className="text-[10px] text-[#00E6E6]">View All</button>
  </div>
  
  <div className="bg-slate-700/40 rounded-lg p-3">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-[#00E6E6] text-xs">
          B
        </div>
        <div>
          <h5 className="text-xs text-white">Business Expansion</h5>
          <div className="flex items-center">
            <span className="text-[10px] text-slate-400 mr-2">1,000 AVAX</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 rounded-full">
              Pending
            </span>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-white">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#00E6E6] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          12 months
        </div>
      </div>
    </div>
    
    <div className="w-full bg-slate-600 h-1.5 rounded-full overflow-hidden mb-2">
      <div className="h-full bg-[#00E6E6]" style={{ width: "75%" }}></div>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-slate-400">75% Funded</span>
      <button className="text-[10px] bg-[#00E6E6] text-slate-900 px-2 py-0.5 rounded hover:bg-[#00E6E6]/90">
        View Details
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default DashboardPreview;
