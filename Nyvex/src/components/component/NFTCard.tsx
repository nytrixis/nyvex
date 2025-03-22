import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvestmentCertificate } from "@/types/nft";
import { ArrowUpRight, Award } from "lucide-react";

interface NFTCardProps {
  certificate: InvestmentCertificate;
  onClick?: () => void;
}

export default function NFTCard({ certificate, onClick }: NFTCardProps) {
  return (
    <Card className="border border-slate-700 hover:border-[#00E6E6]/50 transition-colors duration-300 bg-slate-800/30 backdrop-blur-sm overflow-hidden h-full flex flex-col group">
      <div className="relative overflow-hidden">
        {certificate.metadata.image ? (
          <div className="relative h-48 w-full">
            <Image
              src={certificate.metadata.image}
              alt={certificate.metadata.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-70"></div>
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-[#00E6E6]/20 backdrop-blur-md text-[#00E6E6] border border-[#00E6E6]/20">
                #{certificate.tokenId}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-[#00E6E6]/20 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 text-[#00E6E6]" />
                </div>
                <span className="text-xs font-medium text-white">Investment Certificate</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Award className="h-12 w-12 text-[#00E6E6]/40" />
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow pt-5">
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00E6E6] transition-colors">
          {certificate.startupName}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Investment</span>
            <span className="font-medium text-white bg-slate-700/30 px-2 py-0.5 rounded-md">
              {certificate.investmentAmount} AVAX
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Equity</span>
            <span className="font-medium text-[#00E6E6] bg-[#00E6E6]/10 px-2 py-0.5 rounded-md">
              {certificate.equity}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Date</span>
            <span className="font-medium text-white text-sm">
              {certificate.investmentDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-slate-700 pt-4">
        <Button 
          variant="outline" 
          className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-[#00E6E6] group-hover:border-[#00E6E6]/50 transition-all"
          onClick={onClick}
        >
          View Certificate <ArrowUpRight className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </CardFooter>
    </Card>
  );
}
