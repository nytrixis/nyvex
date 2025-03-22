import React from "react";
import { motion } from "framer-motion";

export function Stats() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Stats data
  const statsData = [
    {
      title: "Total Value Locked",
      value: "$24k",
      change: "+24%",
      positive: true,
      description: "Across all investment pools"
    },
    {
      title: "Active Projects",
      value: "58",
      change: "+12",
      positive: true,
      description: "Currently seeking funding"
    },
    {
      title: "Investor Returns",
      value: "21.4%",
      change: "+5.2%",
      positive: true,
      description: "Average annual ROI"
    },
    {
      title: "Community Size",
      value: "2K",
      change: "+350",
      positive: true,
      description: "Active monthly users"
    },
    {
      title: "Successful Exits",
      value: "23",
      change: "+3",
      positive: true,
      description: "In the last quarter"
    },
    {
      title: "Avg. Funding Time",
      value: "9.2",
      change: "-2.1",
      positive: true,
      description: "Days to complete funding"
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {/* Main stats display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={item}
            className="relative"
          >
            <div className="group h-full">
              {/* Glowing background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00E6E6]/0 to-[#00E6E6]/0 group-hover:from-[#00E6E6]/5 group-hover:to-[#00E6E6]/10 rounded-xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
              
              {/* Card content */}
              <div className="relative h-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 overflow-hidden transition-all duration-300 group-hover:border-[#00E6E6]/30 group-hover:shadow-[0_0_25px_rgba(0,230,230,0.15)]">
                {/* Decorative elements */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#00E6E6]/5 rounded-full blur-xl group-hover:bg-[#00E6E6]/10 transition-all duration-700"></div>
                
                {/* Content */}
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-slate-300 text-sm font-medium mb-1">{stat.title}</h3>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold text-white">{stat.value}</span>
                      <span className={`text-sm font-medium mb-1 ${stat.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{stat.description}</p>
                  </div>
                  
                  {/* Visual indicator */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${30 + Math.random() * 70}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-[#00E6E6] to-[#00E6E6]/70 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="mt-8 p-4 rounded-lg bg-gradient-to-r from-[#1a2942] to-[#1a2942]/80 border border-[#00E6E6]/20"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4 p-2 rounded-full bg-[#00E6E6]/10">
              <TrendingUpIcon className="w-6 h-6 text-[#00E6E6]" />
            </div>
            <div>
              <h4 className="text-white font-medium">Platform Growth</h4>
              <p className="text-slate-300 text-sm">+37% year over year</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#00E6E6] text-slate-900 rounded-md text-sm font-medium hover:bg-[#00E6E6]/90 transition-colors">
              View Detailed Analytics
            </button>
            <button className="px-4 py-2 bg-transparent border border-[#00E6E6]/30 text-[#00E6E6] rounded-md text-sm font-medium hover:bg-[#00E6E6]/10 transition-colors">
              Download Report
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
