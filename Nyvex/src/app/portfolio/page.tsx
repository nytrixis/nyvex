"use client";
import NFTCard from "@/components/component/NFTCard";
import NFTDetailView from "@/components/component/NFTDetailView";
import React, { useState, useEffect, useRef } from "react";
import { useStateContext } from "@/context";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Wallet,
  Award,
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";
import EquityChart from "@/components/component/EquityChart";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Footer from "@/components/component/Footer";
import { InvestmentCertificate } from "@/types/nft"; // Import the type

export default function Portfolio() {
  const { address, getInvestorTokens, getCampaigns } = useStateContext();
  const [investmentTokens, setInvestmentTokens] = useState<InvestmentCertificate[]>([]);
  const [startups, setStartups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<InvestmentCertificate | null>(null);
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: 0,
    totalStartups: 0,
    avgEquity: 0,
    totalEquity: 0,
    earliestInvestment: new Date(),
  });
  // Use refs to track if data has been fetched and prevent duplicate fetches
  const dataFetchedRef = useRef(false);
  const fetchingInProgressRef = useRef(false);

  useEffect(() => {
    // Only fetch data if we have an address, haven't fetched before, and no fetch is in progress
    if (address && !dataFetchedRef.current && !fetchingInProgressRef.current) {
      const fetchData = async () => {
        fetchingInProgressRef.current = true;
        setIsLoading(true);
       
        try {
          // Fetch investment tokens and campaigns in parallel
          const [tokens, campaigns] = await Promise.all([
            getInvestorTokens(),
            getCampaigns()
          ]);
         
          // Only update state if component is still mounted
          setInvestmentTokens(tokens);
          setStartups(campaigns);
         
          // Calculate portfolio statistics
          if (tokens.length > 0) {
            const totalInvested = tokens.reduce((sum, token) => sum + parseFloat(token.investmentAmount), 0);
            const totalEquity = tokens.reduce((sum, token) => sum + parseFloat(token.equity), 0);
            const avgEquity = totalEquity / tokens.length;
            const earliestInvestment = new Date(Math.min(...tokens.map(t => t.investmentDate.getTime())));
           
            setPortfolioStats({
              totalInvested,
              totalStartups: new Set(tokens.map(t => t.startupId)).size,
              avgEquity,
              totalEquity,
              earliestInvestment,
            });
          }
         
          // Mark data as fetched to prevent re-fetching
          dataFetchedRef.current = true;
        } catch (error) {
          console.error("Error fetching portfolio data:", error);
        } finally {
          setIsLoading(false);
          fetchingInProgressRef.current = false;
        }
      };

      fetchData();
    } else if (!address) {
      // If no address, set loading to false
      setIsLoading(false);
    }
  }, [address, getInvestorTokens, getCampaigns]);

  // Group tokens by startup
  const tokensByStartup = investmentTokens.reduce((acc, token) => {
    if (!acc[token.startupId]) {
      acc[token.startupId] = [];
    }
    acc[token.startupId].push(token);
    return acc;
  }, {} as Record<number, InvestmentCertificate[]>);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-[#1a2942] overflow-x-hidden">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Investment <span className="text-[#00E6E6]">Portfolio</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Track and manage your startup investments on the blockchain
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E6E6]"></div>
          </div>
        ) : (
          <>
            {investmentTokens.length > 0 ? (
              <>
                {/* Portfolio Stats */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                  <motion.div variants={fadeIn}>
                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-[#00E6E6]" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Total Invested</p>
                            <p className="text-2xl font-bold text-white">{portfolioStats.totalInvested.toFixed(2)} AVAX</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeIn}>
                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center">
                            <Award className="w-6 h-6 text-[#00E6E6]" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Startups Backed</p>
                            <p className="text-2xl font-bold text-white">{portfolioStats.totalStartups}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeIn}>
                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-[#00E6E6]" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Total Equity</p>
                            <p className="text-2xl font-bold text-white">{portfolioStats.totalEquity.toFixed(2)}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeIn}>
                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[#00E6E6]" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">First Investment</p>
                            <p className="text-2xl font-bold text-white">{portfolioStats.earliestInvestment.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="mb-8"
                >
                  <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-700">
                      <CardTitle className="text-white">Portfolio Overview</CardTitle>
                      <CardDescription className="text-slate-400">
                        View your investments by startup or as individual certificates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Tabs defaultValue="startups" className="w-full">
                        <TabsList className="mb-6 bg-slate-700/50 p-1">
                          <TabsTrigger
                            value="startups"
                            className="data-[state=active]:bg-[#00E6E6] data-[state=active]:text-slate-900"
                          >
                            By Startup
                          </TabsTrigger>
                          <TabsTrigger
                            value="certificates"
                            className="data-[state=active]:bg-[#00E6E6] data-[state=active]:text-slate-900"
                          >
                            Investment Certificates
                          </TabsTrigger>
                        </TabsList>
                       
                        <TabsContent value="startups">
                          <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          >
                            {Object.entries(tokensByStartup).map(([startupId, tokens]) => {
                              const startup = startups.find(s => s.pId === parseInt(startupId));
                              if (!startup) return null;
                             
                              const totalInvested = tokens.reduce((sum, token) => sum + parseFloat(token.investmentAmount), 0);
                              const totalEquity = tokens.reduce((sum, token) => sum + parseFloat(token.equity), 0);
                             
                              return (
                                <motion.div key={startupId} variants={fadeIn}>
                                  <Card className="border border-slate-700 hover:border-[#00E6E6]/50 transition-colors duration-300 bg-slate-800/30 overflow-hidden h-full flex flex-col">
                                    <div className="relative h-48">
                                      <Image
                                        src={startup.image}
                                        alt={startup.title}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                                      <div className="absolute bottom-0 left-0 p-4">
                                        <h3 className="text-xl font-bold text-white">{startup.title}</h3>
                                        <div className="flex items-center mt-1">
                                          <div className="w-full bg-slate-700/70 h-1.5 rounded-full overflow-hidden">
                                            <div                                               className="bg-[#00E6E6] h-1.5 rounded-full"
                                              style={{ width: `${Math.min(100, (parseFloat(startup.amountCollected) / parseFloat(startup.target)) * 100)}%` }}
                                            />
                                          </div>
                                          <span className="text-xs text-white ml-2">
                                            {((parseFloat(startup.amountCollected) / parseFloat(startup.target)) * 100).toFixed(0)}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                   
                                    <CardContent className="flex-grow pt-6">
                                      <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-[#00E6E6]" />
                                            <p className="text-sm text-slate-400">Your Investment</p>
                                          </div>
                                          <p className="font-bold text-white">{totalInvested.toFixed(2)} AVAX</p>
                                        </div>
                                       
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-[#00E6E6]" />
                                            <p className="text-sm text-slate-400">Your Equity</p>
                                          </div>
                                          <p className="font-bold text-white">{totalEquity.toFixed(2)}%</p>
                                        </div>
                                       
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-[#00E6E6]" />
                                            <p className="text-sm text-slate-400">Certificates</p>
                                          </div>
                                          <Badge className="bg-[#00E6E6]/20 text-[#00E6E6] hover:bg-[#00E6E6]/30">{tokens.length}</Badge>
                                        </div>
                                      </div>
                                    </CardContent>
                                   
                                    <CardFooter className="border-t border-slate-700 pt-4">
                                      <Link href={`/startups/${startupId}`} className="w-full">
                                        <Button
                                          variant="outline"
                                          className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-[#00E6E6]"
                                        >
                                          View Startup <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </CardFooter>
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        </TabsContent>
                       
                        {/* UPDATED: Replace with NFTCard component */}
                        <TabsContent value="certificates">
                          <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          >
                            {investmentTokens.map((token) => (
                              <motion.div key={token.tokenId} variants={fadeIn}>
                                <NFTCard 
                                  certificate={token} 
                                  onClick={() => {
                                    setSelectedToken(token);
                                    document.getElementById("certificate-dialog-trigger")?.click();
                                  }}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </TabsContent>
                      </Tabs>
                      
                      {/* ADDED: New Dialog for NFT Detail View */}
                      <Dialog>
                        <DialogTrigger id="certificate-dialog-trigger" asChild>
                          <Button className="hidden">View Certificate</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border border-slate-700 text-white sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-white">
                              Investment Certificate #{selectedToken?.tokenId}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Details of your investment in {selectedToken?.startupName}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedToken && <NFTDetailView certificate={selectedToken} />}
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Portfolio Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                >
                  {/* Equity Distribution */}
                  <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-700">
                      <CardTitle className="text-white">Equity Distribution</CardTitle>
                      <CardDescription className="text-slate-400">Your equity across different startups</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <EquityChart
                        equityHolders={Object.entries(tokensByStartup).map(([startupId, tokens]) => {
                          const startup = startups.find(s => s.pId === parseInt(startupId));
                          const totalEquity = tokens.reduce((sum, token) => sum + parseFloat(token.equity), 0);
                          return {
                            name: startup?.title || `Startup #${startupId}`,
                            percentage: totalEquity.toString()
                          };
                        })}
                        title="Your Equity Distribution"
                        description="How your equity is distributed across startups"
                      />
                    </CardContent>
                  </Card>
                 
                  {/* Investment Timeline */}
                  <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-700">
                      <CardTitle className="text-white">Investment Timeline</CardTitle>
                      <CardDescription className="text-slate-400">History of your investments</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {investmentTokens
                          .sort((a, b) => b.investmentDate.getTime() - a.investmentDate.getTime())
                          .map((token, index) => {
                            const startup = startups.find(s => s.pId === token.startupId);
                            return (
                              <div key={token.tokenId} className="flex items-start gap-4">
                                <div className="min-w-8 h-8 rounded-full bg-[#00E6E6]/20 flex items-center justify-center text-[#00E6E6]">
                                  {index + 1}
                                </div>
                                <div className="flex-1 border-l-2 border-dashed pl-4 pb-6 border-slate-700">
                                  <p className="font-medium text-white">{startup?.title || "Unknown Startup"}</p>
                                  <p className="text-sm text-slate-400">
                                    {token.investmentDate.toLocaleDateString()} • {token.investmentAmount} AVAX • {token.equity}% equity
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden max-w-md w-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-[#00E6E6]/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <Wallet className="w-8 h-8 text-[#00E6E6]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">No Investments Yet</h2>
                    <p className="text-slate-400 mb-6">
                      You haven't made any investments in startups yet. Explore available startups and start building your portfolio.
                    </p>
                    <Link href="/startups">
                      <Button className="bg-[#00E6E6] text-black hover:bg-[#00d1d1] transition-colors">
                        Explore Startups
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
     
      {/* Footer */}
      <Footer />
    </div>
  );
}

                                              
