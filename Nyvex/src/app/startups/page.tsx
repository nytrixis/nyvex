"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useStateContext } from "@/context";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import NFTMintingConfirmation from "@/components/component/NFTMintingConfirmation";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/component/Footer";
import { Search, Filter, Plus, Calendar, Target, Clock, ArrowRight, DollarSign } from "lucide-react";
interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: Date;
  amountCollected: string;
  image: string;
  video: string;
  donations: { funderAddress: string; amount: string }[];
  pId: number;
  funders: { funderAddress: string; amount: string; tokenId: string }[];
}

export default function StartupsPage() {
  const { address, getCampaigns, fundStartup, withdrawStartupFunds } = useStateContext();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [filterMyCampaigns, setFilterMyCampaigns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetails, setViewDetails] = useState(false);
  const [isInvesting, setIsInvesting] = useState<boolean>(false);
  const [investmentSuccess, setInvestmentSuccess] = useState<boolean>(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [currentStartupId, setCurrentStartupId] = useState<number | null>(null);
  const [currentStartupName, setCurrentStartupName] = useState<string>("");

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

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const fetchedCampaigns: Campaign[] = await getCampaigns();
        setCampaigns(fetchedCampaigns);
        
        if (filterMyCampaigns) {
          setFilteredCampaigns(
            fetchedCampaigns.filter((campaign) => campaign.owner === address)
          );
        } else {
          setFilteredCampaigns(fetchedCampaigns);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [getCampaigns, filterMyCampaigns, address]);

  // Filter campaigns based on search term
  useEffect(() => {
    let result = campaigns;
    
    // Apply owner filter
    if (filterMyCampaigns) {
      result = result.filter((campaign) => campaign.owner === address);
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCampaigns(result);
  }, [searchTerm, filterMyCampaigns, campaigns, address]);

  // Helper function to get the latest token ID for an address
  const getLatestTokenIdForAddress = async (startupId: number, investorAddress: string) => {
    const campaigns = await getCampaigns();
    const startup = campaigns.find(c => c.pId === startupId);
    
    if (!startup || !startup.funders) return null;
    
    // Find the most recent funding by this address
    const myFundings = startup.funders
    .filter((f: {funderAddress: string; amount: string; tokenId: string}) => f.funderAddress === investorAddress)
    .sort((a: {tokenId: string}, b: {tokenId: string}) => parseInt(b.tokenId) - parseInt(a.tokenId));
      
    if (myFundings.length > 0) {
      return myFundings[0].tokenId;
    }
    
    return null;
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
            Startup <span className="text-[#00E6E6]">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover innovative startups or showcase your own venture to potential investors
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00E6E6] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
              <Filter size={18} className="text-slate-400" />
              <select
                value={filterMyCampaigns ? "my" : "all"}
                onChange={(e) => setFilterMyCampaigns(e.target.value === "my")}
                className="bg-transparent text-white focus:outline-none"
              >
                <option value="all" className="bg-slate-800">All Startups</option>
                <option value="my" className="bg-slate-800">My Startups</option>
              </select>
            </div>

            <Link href="/startups/create-startup">
              <Button
                className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Create Startup
              </Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E6E6]"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center text-slate-400 py-16 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No startups found</h3>
            <p className="mb-6">There are no startups matching your criteria</p>
            <Link href="/startups/create-startup">
              <Button
                className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
              >
                Create Your Startup
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCampaigns.map((campaign, idx) => {
              const videoId = campaign.video.split("=").pop();
              const embedUrl = `https://www.youtube.com/embed/${videoId}`;

              const currentDate = new Date();
              const deadlineDate = new Date(campaign.deadline);
              const timeDifference = deadlineDate.getTime() - currentDate.getTime();
              const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

              const percentFunded = Math.min(
                (parseFloat(campaign.amountCollected) / parseFloat(campaign.target)) * 100,
                100
              );

              return (
                <motion.div
                  key={idx}
                  variants={fadeIn}
                  className="h-full"
                >
                  <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {campaign.owner === address && (
                        <div className="absolute top-3 right-3 bg-[#00E6E6] text-slate-900 text-xs font-medium px-2 py-1 rounded-full">
                          Your Startup
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <div className="h-1 w-full bg-slate-700">
                        <div
                          className="h-1 bg-[#00E6E6]"
                          style={{ width: `${percentFunded}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-xl">{campaign.title}</CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-4 flex-grow">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-sm mb-1 flex items-center">
                            <Target size={14} className="mr-1 text-[#00E6E6]" />
                            Target
                          </span>
                          <span className="text-white font-medium">{campaign.target} AVAX</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-sm mb-1 flex items-center">
                            <DollarSign size={14} className="mr-1 text-[#00E6E6]" />
                            Collected
                          </span>
                          <span className="text-white font-medium">{campaign.amountCollected} AVAX</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-sm mb-1 flex items-center">
                            <Calendar size={14} className="mr-1 text-[#00E6E6]" />
                            Deadline
                          </span>
                          <span className="text-white font-medium">{deadlineDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-sm mb-1 flex items-center">
                            <Clock size={14} className="mr-1 text-[#00E6E6]" />
                            Remaining
                          </span>
                          <span className={`font-medium ${daysRemaining > 0 ? 'text-white' : 'text-red-400'}`}>
                            {daysRemaining > 0 ? `${daysRemaining} days` : 'Ended'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-700/30 rounded-lg px-3 py-2 text-sm text-slate-300">
                        <div className="flex justify-between items-center">
                          <span>{percentFunded.toFixed(0)}% funded</span>
                          <span>{campaign.funders?.length || 0} backers</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Dialog onOpenChange={(isOpen) => setViewDetails(isOpen)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center"
                          >
                            View Details
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-white">{campaign.title}</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Created by: {campaign.owner.substring(0, 6)}...{campaign.owner.substring(campaign.owner.length - 4)}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div>
                              <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 mb-4">
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-full"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-white font-medium mb-2 flex items-center">
                                    <Target size={16} className="mr-2 text-[#00E6E6]" />
                                    Funding Goal
                                  </h4>
                                  <div className="flex items-center">
                                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-2 bg-[#00E6E6]"
                                        style={{
                                          width: `${percentFunded}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="ml-2 text-white font-medium">
                                      {percentFunded.toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-700/30 p-3 rounded-lg">
                                    <p className="text-sm text-slate-400 mb-1">Target</p>
                                    <p className="text-lg font-medium text-white">{campaign.target} AVAX</p>
                                  </div>
                                  <div className="bg-slate-700/30 p-3 rounded-lg">
                                    <p className="text-sm text-slate-400 mb-1">Collected</p>
                                    <p className="text-lg font-medium text-white">{campaign.amountCollected} AVAX</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-white font-medium mb-2 flex items-center">
                                    <Clock size={16} className="mr-2 text-[#00E6E6]" />
                                    Time Remaining
                                  </h4>
                                  {daysRemaining > 0 ? (
                                    <div className="bg-slate-700/30 p-3 rounded-lg">
                                      <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold text-white">{daysRemaining}</span>
                                        <span className="text-slate-400 mb-1">days left</span>
                                      </div>
                                      <p className="text-sm text-slate-400 mt-1">Deadline: {deadlineDate.toLocaleDateString()}</p>
                                    </div>
                                  ) : (
                                    <div className="bg-red-900/30 border border-red-800/50 p-3 rounded-lg">
                                      <p className="text-lg font-medium text-red-400">Funding period has ended</p>
                                      <p className="text-sm text-slate-400 mt-1">Deadline was: {deadlineDate.toLocaleDateString()}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-white font-medium mb-3 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  About This Startup
                                </h4>
                                <div className="bg-slate-700/30 p-4 rounded-lg">
                                  <p className="text-slate-300 whitespace-pre-line">
                                    {campaign.description}
                                  </p>
                                </div>
                              </div>
                              
                              {campaign.funders && campaign.funders.length > 0 && (
                                <div>
                                  <h4 className="text-white font-medium mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Backers
                                  </h4>
                                  <div className="bg-slate-700/30 p-4 rounded-lg max-h-40 overflow-y-auto">
                                    <div className="space-y-2">
                                      {campaign.funders.map((funder, donationIndex) => (
                                        <div
                                          key={donationIndex}
                                          className="flex items-center justify-between border-b border-slate-600 last:border-0 pb-2 last:pb-0"
                                        >
                                          <div className="font-medium text-slate-300 text-sm">
                                            {funder.funderAddress.substring(0, 6)}...{funder.funderAddress.substring(funder.funderAddress.length - 4)}
                                          </div>
                                          <div className="text-[#00E6E6] text-sm">{funder.amount} AVAX</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="pt-4">
                                {campaign.owner === address ? (
                                  <Button
                                    onClick={() => withdrawStartupFunds(campaign.pId)}
                                    className="w-full bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                                    disabled={
                                      daysRemaining > 0 || 
                                      parseFloat(campaign.amountCollected) < parseFloat(campaign.target)
                                    }
                                  >
                                    {daysRemaining > 0 ? (
                                      "Cannot withdraw before deadline"
                                    ) : parseFloat(campaign.amountCollected) < parseFloat(campaign.target) ? (
                                      "Target not reached"
                                    ) : (
                                      "Withdraw Funds"
                                    )}
                                  </Button>
                                ) : (
                                  <Popover onOpenChange={(open) => {
                                    // Reset states when popover is closed
                                    if (!open) {
                                      setInvestmentSuccess(false);
                                      setMintedTokenId(null);
                                      setFundAmount("");
                                    }
                                  }}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        className="w-full bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                                        disabled={daysRemaining <= 0}
                                      >
                                        {daysRemaining <= 0 ? "Funding Ended" : "Fund This Startup"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-slate-800 border border-slate-700 text-white">
                                      {investmentSuccess && mintedTokenId ? (
                                        <NFTMintingConfirmation 
                                          tokenId={mintedTokenId} 
                                          startupName={campaign.title} 
                                          onClose={() => {
                                            setInvestmentSuccess(false);
                                            setMintedTokenId(null);
                                            const closeButton = document.querySelector('[data-radix-popper-content-wrapper]')?.querySelector('button[aria-label="Close"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  }}
/>
                                      ) : (
                                        <div className="space-y-4">
                                          <h4 className="font-medium text-white">Support this startup</h4>
                                          <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-slate-300">
                                              Amount to fund (AVAX)
                                            </Label>
                                            <Input
                                              id="amount"
                                              type="text"
                                              placeholder="Enter amount"
                                              className="bg-slate-700 border-slate-600 text-white"
                                              onChange={(e) => setFundAmount(e.target.value)}
                                            />
                                          </div>
                                          <Button
                                            onClick={async () => {
                                              if (!fundAmount || parseFloat(fundAmount) <= 0) {
                                                alert("Please enter a valid amount");
                                                return;
                                              }
                                              
                                              setIsInvesting(true);
                                              setCurrentStartupId(campaign.pId);
                                              setCurrentStartupName(campaign.title);
                                              
                                              try {
                                                // Fund the startup and get transaction result
                                                const txResult = await fundStartup(campaign.pId, fundAmount);
                                                console.log("Investment transaction:", txResult);
                                                
                                                // Wait a moment for blockchain to update
                                                await new Promise(resolve => setTimeout(resolve, 2000));
                                                
                                                // Get updated campaign data
                                                const updatedCampaigns = await getCampaigns();
                                                const updatedCampaign = updatedCampaigns.find(c => c.pId === campaign.pId);
                                                
                                                if (!updatedCampaign) {
                                                  throw new Error("Failed to retrieve updated campaign data");
                                                }
                                                
                                                // Find the token ID from the updated campaign
                                                // Find the token ID from the updated campaign
const myFundings = updatedCampaign.funders
.filter((f: { funderAddress: string; amount: string; tokenId: string }) => 
  f.funderAddress.toLowerCase() === address.toLowerCase()
)
.sort((a: { tokenId: string }, b: { tokenId: string }) => 
  parseInt(b.tokenId) - parseInt(a.tokenId)
);

                                                
                                                const tokenId = myFundings.length > 0 ? myFundings[0].tokenId : null;
                                                
                                                if (!tokenId) {
                                                  console.warn("Could not find token ID for the investment");
                                                }
                                                
                                                // Update state with new data
                                                setMintedTokenId(tokenId || "Unknown");
                                                setCampaigns(updatedCampaigns);
                                                setFilteredCampaigns(
                                                  filterMyCampaigns 
                                                    ? updatedCampaigns.filter(c => c.owner === address)
                                                    : updatedCampaigns
                                                );
                                                
                                                setInvestmentSuccess(true);
                                                setFundAmount("");
                                              } catch (error) {
                                                console.error("Failed to fund startup:", error);
                                                alert(`Investment failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                                              } finally {
                                                setIsInvesting(false);
                                              }
                                            }}
                                            className="w-full bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1]"
                                            disabled={isInvesting}
                                          >
                                            {isInvesting ? (
                                              <ClipLoader size={20} color="#1a2942" />
                                            ) : (
                                              "Proceed"
                                            )}
                                          </Button>
                                        </div>
                                      )}
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        
        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-white">Fast Funding</CardTitle>
              <CardDescription className="text-slate-400">
                Get your startup funded quickly without the lengthy approval processes of traditional venture capital.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <CardTitle className="text-white">Secure & Transparent</CardTitle>
              <CardDescription className="text-slate-400">
                All investments are secured by blockchain technology, ensuring complete transparency and security.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <CardTitle className="text-white">Community Backed</CardTitle>
              <CardDescription className="text-slate-400">
                Get funded by a diverse community of investors who believe in your vision and want to see you succeed.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 mb-8"
        >
          <Card className="border-slate-700 bg-gradient-to-r from-slate-800 to-[#1a2942] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E6E6]/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
            <CardContent className="p-8 md:p-12 relative">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Have a brilliant startup idea?
                </h3>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                  Create a startup campaign and get funded by our community of investors. Our platform makes it easy to showcase your vision and secure the capital you need.
                </p>
                <Link href="/startups/create-startup">
                  <Button
                    className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors px-8 py-6 text-lg"
                  >
                    Launch Your Startup
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
