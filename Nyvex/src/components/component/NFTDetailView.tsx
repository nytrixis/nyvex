import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InvestmentCertificate } from "@/types/nft";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Share2, Award, Calendar, DollarSign, BarChart3, User } from "lucide-react";

interface NFTDetailViewProps {
  certificate: InvestmentCertificate;
}

export default function NFTDetailView({ certificate }: NFTDetailViewProps) {
  // Function to download the NFT image
  const downloadImage = async () => {
    try {
      const response = await fetch(certificate.metadata.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NyveX-Certificate-${certificate.tokenId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // Function to view on block explorer (Avalanche C-Chain)
  const viewOnExplorer = () => {
    window.open(`https://testnet.snowtrace.io/token/${certificate.tokenId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {certificate.metadata.image && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xs relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E6E6]/50 to-[#00E6E6]/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative">
            <Image
              src={certificate.metadata.image}
              alt="Certificate"
              width={300}
              height={300}
              className="rounded-lg border border-slate-700 bg-slate-800 shadow-xl"
            />
            <div className="absolute top-3 right-3">
              <div className="px-2 py-1 bg-[#00E6E6]/20 backdrop-blur-md rounded-full text-xs font-medium text-[#00E6E6] border border-[#00E6E6]/20">
                #{certificate.tokenId}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-3.5 w-3.5 text-[#00E6E6]" />
            <p className="text-sm text-slate-400">Startup</p>
          </div>
          <p className="font-medium text-white">{certificate.startupName}</p>
        </div>
        
        <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3.5 w-3.5 text-[#00E6E6] flex items-center justify-center text-xs font-bold">#</div>
            <p className="text-sm text-slate-400">Token ID</p>
          </div>
          <p className="font-medium text-white">#{certificate.tokenId}</p>
        </div>
        
        <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3.5 w-3.5 text-[#00E6E6]" />
            <p className="text-sm text-slate-400">Investment</p>
          </div>
          <p className="font-medium text-white">{certificate.investmentAmount} AVAX</p>
        </div>
        
        <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3.5 w-3.5 text-[#00E6E6]" />
            <p className="text-sm text-slate-400">Equity</p>
          </div>
          <p className="font-medium text-white">{certificate.equity}%</p>
        </div>
        
        <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3.5 w-3.5 text-[#00E6E6]" />
            <p className="text-sm text-slate-400">Date</p>
          </div>
          <p className="font-medium text-white">{certificate.investmentDate.toLocaleDateString()}</p>
        </div>
        
        <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3.5 w-3.5 text-[#00E6E6]" />
            <p className="text-sm text-slate-400">Owner</p>
          </div>
          <p className="font-medium text-white truncate">{certificate.ownerAddress.substring(0, 8)}...</p>
        </div>
      </motion.div>
      
      {certificate.metadata?.attributes && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-slate-700 pt-4"
        >
          <p className="text-sm font-medium text-white mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Certificate Attributes
          </p>
          <div className="grid grid-cols-2 gap-2">
            {certificate.metadata.attributes.map((attr, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (i * 0.05) }}
                className="bg-slate-800/60 border border-slate-700/50 p-2 rounded-md hover:border-slate-600 transition-colors"
              >
                <p className="text-xs text-slate-400">{attr.trait_type}</p>
                <p className="text-sm font-medium text-white truncate">{attr.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex gap-2 pt-2"
      >
        <Button 
          variant="outline" 
          className="flex-1 border-slate-700 text-slate-300 hover:bg-[#00E6E6]/10 hover:text-[#00E6E6] hover:border-[#00E6E6]/50 transition-all"
          onClick={downloadImage}
        >
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-slate-700 text-slate-300 hover:bg-[#00E6E6]/10 hover:text-[#00E6E6] hover:border-[#00E6E6]/50 transition-all"
          onClick={viewOnExplorer}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> View on Explorer
        </Button>
      </motion.div>
    </div>
  );
}
