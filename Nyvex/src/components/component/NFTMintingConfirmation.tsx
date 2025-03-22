import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NFTMintingConfirmationProps {
  tokenId: string;
  startupName: string;
  onClose: () => void;
}

export default function NFTMintingConfirmation({ 
  tokenId, 
  startupName 
}: NFTMintingConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center p-6 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#00E6E6] blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#00E6E6] blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className="w-24 h-24 bg-gradient-to-br from-[#00E6E6]/30 to-[#00E6E6]/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00E6E6]/20 shadow-lg shadow-[#00E6E6]/5"
        >
          <CheckCircle className="h-12 w-12 text-[#00E6E6]" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-3 text-white">Investment Successful!</h2>
          <div className="max-w-md mx-auto">
            <p className="text-slate-300 mb-2 text-lg">
              Your investment in <span className="text-[#00E6E6] font-medium">{startupName}</span> has been confirmed.
            </p>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg py-3 px-4 mb-6 inline-block">
              <div className="flex items-center justify-center gap-2">
                <Wallet className="h-5 w-5 text-[#00E6E6]" />
                <p className="text-white">
                  NFT Certificate <span className="font-mono font-medium text-[#00E6E6]">#{tokenId}</span> minted to your wallet
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
        >
          <Link href="/portfolio">
            <Button className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors px-6 py-5 text-base font-medium">
              View in Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-[#00E6E6]/30 transition-all px-6 py-5 text-base"
          >
            Continue Browsing
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
