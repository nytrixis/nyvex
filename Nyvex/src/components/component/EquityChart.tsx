"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface EquityHolder {
  name: string;
  percentage: string;
}

interface EquityChartProps {
  equityHolders: EquityHolder[];
  title?: string;
  description?: string;
}

const EquityChart: React.FC<EquityChartProps> = ({ 
  equityHolders, 
  title = "Equity Distribution", 
  description = "Breakdown of equity allocation among stakeholders" 
}) => {
  const [chartData, setChartData] = useState<any>(null);
  
  // Generate a color palette that matches the app's theme
  const generateColorPalette = (count: number) => {
    const baseColors = [
      "#00d8ff", // Primary cyan
      "#1a2942", // Dark blue
      "#00E6E6", // Bright cyan
      "#5A7D7C", // Teal
      "#00b8d4", // Light blue
    ];
    
    // If we need more colors than in our base palette, generate variations
    const colors = [];
    for (let i = 0; i < count; i++) {
      if (i < baseColors.length) {
        colors.push(baseColors[i]);
      } else {
        // Create variations by adjusting opacity or creating lighter/darker versions
        const baseColor = baseColors[i % baseColors.length];
        const opacity = 0.7 - (Math.floor(i / baseColors.length) * 0.15);
        colors.push(baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
      }
    }
    
    return colors;
  };

  useEffect(() => {
    if (equityHolders && equityHolders.length > 0) {
      const labels = equityHolders.map(holder => holder.name);
      const data = equityHolders.map(holder => parseFloat(holder.percentage));
      const backgroundColor = generateColorPalette(equityHolders.length);
      
      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor,
            borderColor: backgroundColor.map(color => color),
            borderWidth: 1,
            hoverOffset: 15,
          },
        ],
      });
    }
  }, [equityHolders]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Chart options
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        },
        backgroundColor: 'rgba(26, 41, 66, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00d8ff',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Calculate total equity percentage
  const totalEquity = equityHolders.reduce(
    (sum, holder) => sum + parseFloat(holder.percentage), 
    0
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info size={18} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">About Equity Distribution</h4>
                  <p className="text-sm text-muted-foreground">
                    This chart shows how equity is distributed among the startup's stakeholders.
                    The percentages represent ownership stakes in the company.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total allocated: {totalEquity.toFixed(2)}%
                  </p>
                  {totalEquity < 100 && (
                    <p className="text-sm text-amber-500">
                      Note: {(100 - totalEquity).toFixed(2)}% of equity is unallocated.
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants} 
              className="h-64 flex items-center justify-center"
            >
              {chartData && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Doughnut data={chartData} options={options} />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{totalEquity.toFixed(0)}%</span>
                    <span className="text-xs text-muted-foreground">Allocated</span>
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Stakeholders</h3>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {equityHolders.map((holder, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: chartData?.datasets[0].backgroundColor[index] }}
                      />
                      <span className="font-medium">{holder.name}</span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {parseFloat(holder.percentage).toFixed(2)}%
                    </Badge>
                  </motion.div>
                ))}
              </div>
              
              {totalEquity < 100 && (
                <div className="pt-3 border-t border-dashed border-muted-foreground/20">
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3 bg-gray-300 dark:bg-gray-700" />
                      <span className="font-medium text-muted-foreground">Unallocated</span>
                    </div>
                    <Badge variant="outline" className="font-mono bg-gray-100 dark:bg-gray-800">
                      {(100 - totalEquity).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EquityChart;
