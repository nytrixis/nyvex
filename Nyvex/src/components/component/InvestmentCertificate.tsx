"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvestmentCertificate as InvestmentCertificateType } from "@/types/nft";
import { Download, Share2 } from "lucide-react";
import QRCode from "react-qr-code";

interface InvestmentCertificateProps {
  certificate: InvestmentCertificateType;
  className?: string;
}

const InvestmentCertificate: React.FC<InvestmentCertificateProps> = ({
  certificate,
  className,
}) => {
  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate verification URL
  const verificationUrl = `https://testnet.snowtrace.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${certificate.tokenId}`;

  // Download certificate as image
  const downloadCertificate = () => {
    const certificateElement = document.getElementById("certificate");
    if (!certificateElement) return;

    // Use html2canvas to capture the certificate as an image
    // This is a simplified version - you would need to add html2canvas library
    alert("Download functionality would be implemented here with html2canvas");
  };

  // Share certificate
  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Investment Certificate for ${certificate.startupName}`,
          text: `I invested ${certificate.investmentAmount} AVAX in ${certificate.startupName}!`,
          url: verificationUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(verificationUrl);
      alert("Verification link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        id="certificate"
        className="relative overflow-hidden border-2 border-[#00d8ff] bg-gradient-to-br from-zinc-900 to-zinc-800 text-white shadow-lg"
      >
        {/* Certificate Border */}
        <div className="absolute inset-0 border-8 border-double border-[#00d8ff]/20 m-2 pointer-events-none"></div>
        
        {/* Certificate Header */}
        <div className="pt-8 px-6 text-center">
          <h2 className="text-2xl font-bold text-[#00d8ff]">INVESTMENT CERTIFICATE</h2>
          <p className="text-zinc-400 mt-1">Venturâ Platform</p>
        </div>

        <CardContent className="p-6">
          {/* Certificate Content */}
          <div className="flex flex-col items-center space-y-6">
            {/* Logo or Image */}
            <div className="relative w-24 h-24 mb-2">
              {certificate.metadata.image ? (
                <Image
                  src={certificate.metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                  alt="Certificate"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-700 rounded-full">
                  <span className="text-[#00d8ff] text-4xl">V</span>
                </div>
              )}
            </div>

            {/* Certificate Text */}
            <div className="text-center space-y-2">
              <p className="text-zinc-300">This certifies that</p>
              <h3 className="text-xl font-semibold truncate max-w-[250px]">
                {certificate.ownerAddress.substring(0, 6)}...{certificate.ownerAddress.substring(38)}
              </h3>
              <p className="text-zinc-300">has invested</p>
              <h3 className="text-2xl font-bold text-[#00d8ff]">
                {certificate.investmentAmount} AVAX
              </h3>
              <p className="text-zinc-300">in</p>
              <h3 className="text-xl font-semibold">{certificate.startupName}</h3>
              <p className="text-zinc-300">on</p>
              <p className="font-medium">{formatDate(certificate.investmentDate)}</p>
              
              {certificate.equity && (
                <div className="mt-2">
                  <p className="text-zinc-300">Equity Percentage</p>
                  <p className="text-lg font-semibold text-[#00d8ff]">{certificate.equity}%</p>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="bg-white p-2 rounded-md">
              <QRCode
                value={verificationUrl}
                size={100}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            
            <p className="text-xs text-zinc-400">
              Token ID: {certificate.tokenId} • Verify on Snowtrace
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="border-[#00d8ff] text-[#00d8ff] hover:bg-[#00d8ff] hover:text-black"
              onClick={downloadCertificate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#00d8ff] text-[#00d8ff] hover:bg-[#00d8ff] hover:text-black"
              onClick={shareCertificate}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvestmentCertificate;
