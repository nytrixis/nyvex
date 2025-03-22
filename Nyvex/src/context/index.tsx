"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
  BaseTransactionOptions,
} from "thirdweb";
import { defineChain } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { ethers } from "ethers";
import { client } from "../app/client";
import { sepolia } from "thirdweb/chains";
import { formatEther } from "ethers";
import { uploadToIPFS, uploadMetadataToIPFS, getIPFSGatewayURL } from "@/services/ipfs";

interface StateContextType {
  address: string;
  contract: any;
  account: any;
  connect: () => Promise<void>;
  createStartupCampaign: (
    title: string,
    description: string,
    target: string,
    deadline: number,
    image: string,
    video: string,
    equityHolders: { name: string; percentage: bigint }[]
  ) => Promise<void>;
  applyForLoan: (
    amount: string,
    purpose: string,
    name: string,
    duration: number
  ) => Promise<void>;
  lendLoan: (lId: number, amount: string) => Promise<any>;
  getCampaigns: () => Promise<any[]>;
  getLoanRequests: () => Promise<any[]>;
  withdrawStartupFunds: (pId: number) => Promise<any>;
  fundStartup: (pId: number, amount: string) => Promise<any>;
  withdrawLoanFunds: (lId: number) => Promise<any>;
  repayLoan: (lId: number, amount: string) => Promise<any>;
  uploadDocument: (startupId: number, file: File, documentType: string) => Promise<string>;
  getStartupDocuments: (startupId: number) => Promise<any[]>;
  isLoading: boolean;
  
  // Add other new functions we'll need
  getInvestorTokens: (investorAddress?: string) => Promise<any[]>;
  createMilestone: (startupId: number, title: string, description: string, fundAmount: number) => Promise<void>;
  completeMilestone: (startupId: number, milestoneId: number, proofFile: File) => Promise<void>;
  getStartupMilestones: (startupId: number) => Promise<any[]>;
  verifyStartup: (startupId: number) => Promise<void>;
  isVerifier: () => Promise<boolean>;
  hasInvestedInStartup: (startupId: number) => Promise<boolean>;
  getInvestmentAmount: (startupId: number) => Promise<string>;
  refundInvestment: (startupId: number) => Promise<void>;
  addLoanDocument: (loanId: number, file: File, documentType: string) => Promise<string>;
  getLoanDocuments: (loanId: number) => Promise<any[]>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      const wallet = createWallet("io.metamask");
      const account = await wallet.connect({ client });
      setAddress(account.address);
      setAccount(account);
      const contract = await getContract({
        client,
        chain: defineChain(43113),
        address: "0xC6a6E3c2a50B296C3E61E90b8cE26Ea5CC8AEC2A",
      });
      setContract(contract);
      console.log("Contract initialized", contract);
    };

    initialize();
  }, []);

  const connect = async () => {
    try {
      const wallet = createWallet("io.metamask");
      const account = await wallet.connect({ client });
      setAddress(account.address);
      setAccount(account);
      console.log("Connected to wallet", account);
    } catch (error) {
      console.error("Error connecting to wallet", error);
    }
  };

  const createStartupCampaign = async (
    title: string,
    description: string,
    target: string,
    deadline: number,
    image: string,
    video: string,
    equityHolders: { name: string; percentage: bigint }[]
  ) => {
    console.log("Creating startup campaign with:", {
      title,
      description,
      target,
      deadline,
      image,
      video,
      equityHolders,
    });

    const preparedTx = await prepareContractCall({
      contract,
      method:
        "function createStartup(address _owner, string _title, string _description, (string name, uint256 percentage)[] _equityHolders, string _pitchVideo, string _image, uint256 _target, uint256 _deadline) returns (uint256)",
      params: [
        address,
        title,
        description,
        equityHolders,
        video,
        image,
        toWei(target),
        BigInt(deadline),
      ],
    });

    try {
      console.log("Creating startup campaign", preparedTx);
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      console.log("Contract call success", tx);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const applyForLoan = async (
    amount: string,
    purpose: string,
    name: string,
    duration: number
  ) => {
    console.log("Applying for loan with:", {
      amount,
      purpose,
      name,
      duration,
    });

    const preparedTx = prepareContractCall({
      contract,
      method:
        "function requestLoan(address _requester, string _name, string _purpose, uint256 _amount, uint256 _duration) returns (uint256)",
      params: [
        address,
        name,
        purpose,
        ethers.parseEther(amount),
        BigInt(duration),
      ],
    });

    try {
      console.log("Applying for loan", preparedTx);
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      console.log("Loan application successful", tx);
    } catch (error) {
      console.error("Loan application failed", error);
    }
  };

  async function getCampaigns() {
    try {
      const campaigns = await readContract({
        contract,
        method:
          "function getStartups() view returns ((address owner, string title, string description, (string name, uint256 percentage)[] equityHolders, string pitchVideo, string image, uint256 target, uint256 deadline, uint256 amountCollected, uint256 amountReleased, (address funderAddress, uint256 amount, uint256 tokenId)[] funders, (string ipfsHash, string documentType, uint256 timestamp)[] documentHashes, (string title, string description, uint256 fundAmount, bool isCompleted, string ipfsHash, uint256 completionTimestamp)[] milestones, bool isVerified)[])",
        params: [],
      });

      // Map the returned campaigns to your desired format
      return campaigns.map((campaign: any, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: formatEther(campaign.target.toString()), // Convert to Ether
        deadline: new Date(Number(campaign.deadline)), // Convert to Date
        amountCollected: formatEther(campaign.amountCollected.toString()), // Convert to Ether
        amountReleased: formatEther(campaign.amountReleased.toString()), // Convert to Ether
        image: campaign.image,
        video: campaign.pitchVideo,
        isVerified: campaign.isVerified,
        equityHolders: campaign.equityHolders.map((holder: any) => ({
          name: holder.name,
          percentage: holder.percentage.toString(),
        })),
        funders: campaign.funders.map((funder: any) => ({
          funderAddress: funder.funderAddress,
          amount: formatEther(funder.amount.toString()), // Convert to Ether
          tokenId: funder.tokenId.toString(),
        })),
        documents: campaign.documentHashes.map((doc: any) => ({
          ipfsHash: doc.ipfsHash,
          documentType: doc.documentType,
          timestamp: new Date(Number(doc.timestamp)),
        })),
        milestones: campaign.milestones.map((milestone: any) => ({
          title: milestone.title,
          description: milestone.description,
          fundAmount: formatEther(milestone.fundAmount.toString()),
          isCompleted: milestone.isCompleted,
          proofIpfsHash: milestone.ipfsHash,
          completionTimestamp: milestone.completionTimestamp.toNumber() > 0
            ? new Date(milestone.completionTimestamp.toNumber() * 1000)
            : undefined,
        })),
        pId: i,
      }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  }

  async function getLoanRequests() {
    try {
      const loans = await readContract({
        contract,
        method:
          "function getLoanRequests() view returns ((address requester, string name, string purpose, uint256 amount, uint256 duration, uint256 amountCollected, (address funderAddress, uint256 amount, uint256 tokenId)[] lenders, (string ipfsHash, string documentType, uint256 timestamp)[] documentHashes, bool repaid)[])",
        params: [],
      });
      return loans.map((loan: any, i: number) => ({
        requester: loan.requester,
        name: loan.name,
        purpose: loan.purpose,
        amount: formatEther(loan.amount.toString()),
        duration: loan.duration,
        amountCollected: formatEther(loan.amountCollected.toString()),
        repaid: loan.repaid,
        lenders: loan.lenders
          ? loan.lenders.map((lender: any) => ({
              address: lender.funderAddress,
              amount: formatEther(lender.amount.toString()),
              tokenId: lender.tokenId.toString(),
            }))
          : [],
        documents: loan.documentHashes.map((doc: any) => ({
          ipfsHash: doc.ipfsHash,
          documentType: doc.documentType,
          timestamp: new Date(Number(doc.timestamp)),
        })),
        lId: i,
      }));
    } catch (error) {
      console.error("Error fetching loan requests:", error);
      return [];
    }
  }

  async function lendLoan(lId: number, amount: string) {
    const preparedTx = prepareContractCall({
      contract,
      method: "function fundLoan(uint256 _id) payable",
      params: [BigInt(lId)],
      value: BigInt(toWei(amount)),
    });

    try {
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      return tx;
    } catch (error) {
      console.error("Error lending loan:", error);
      return [];
    }
  }

  async function fundStartup(pId: number, amount: string) {
    const preparedTx = await prepareContractCall({
      contract,
      method: "function fundStartup(uint256 _id) payable",
      params: [BigInt(pId)],
      value: BigInt(toWei(amount)),
    });

    try {
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      return { 
        transactionHash: tx.transactionHash,
        // No logs since we're not waiting for the receipt
      };
    } catch (error) {
      console.error("Error funding startup:", error);
      throw error;
    }
  }
  async function withdrawStartupFunds(pId: number) {
    const preparedTx = await prepareContractCall({
      contract,
      method: "function withdrawFunds(uint256 _id)",
      params: [BigInt(pId)],
    });

    try {
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      return tx;
    } catch (error) {
      console.error("Error withdrawing startup funds:", error);
      return [];
    }
  }

  async function withdrawLoanFunds(lId: number) {
    const preparedTx = await prepareContractCall({
      contract,
      method: "function withdrawLoanFunds(uint256 _id)",
      params: [BigInt(lId)],
    });

    try {
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      return tx;
    } catch (error) {
      console.error("Error withdrawing loan funds:", error);
      return [];
    }
  }

  async function repayLoan(lId: number, amount: string) {
    const preparedTx = await prepareContractCall({
      contract,
      method: "function repayLoan(uint256 _id) payable",
      params: [BigInt(lId)],
      value: BigInt(toWei(amount)),
    });
    try {
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      return tx;
    } catch (error) {
      console.error("Error repaying loan:", error);
      return [];
    }
  }

  // Upload document for a startup
  const uploadDocument = async (startupId: number, file: File, documentType: string): Promise<string> => {
    if (!contract) return "";
    
    try {
      setIsLoading(true);
      
      // Upload file to IPFS
      const cid = await uploadToIPFS(file);
      
      // Call contract function to add document reference
      const preparedTx = await prepareContractCall({
        contract,
        method: "function addStartupDocument(uint256 _id, string _ipfsHash, string _documentType)",
        params: [BigInt(startupId), cid, documentType],
      });
      
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });
      
      console.log(`Document uploaded for startup ${startupId}: ${file.name} (${documentType})`);
      
      // Return the document CID
      return cid;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get documents for a startup
  const getStartupDocuments = async (startupId: number): Promise<any[]> => {
    if (!contract) return [];
    
    try {
      setIsLoading(true);
      
            // Call contract function to get documents
      const documents = await readContract({
        contract,
        method: "function getStartupDocuments(uint256 _id) view returns ((string ipfsHash, string documentType, uint256 timestamp)[])",
        params: [BigInt(startupId)],
      });
      
      // Format documents
      const formattedDocuments = documents.map((doc: any) => {
        return {
          ipfsHash: doc.ipfsHash,
          documentType: doc.documentType,
          timestamp: new Date(Number(doc.timestamp) * 1000),
          url: getIPFSGatewayURL(doc.ipfsHash),
          metadata: {
            name: `Document-${doc.documentType}`, // We don't have the original name in the contract
            type: doc.documentType,
            cid: doc.ipfsHash,
          }
        };
      });
      
      return formattedDocuments;
    } catch (error) {
      console.error("Error getting startup documents:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get investor tokens (NFT certificates)
  const getInvestorTokens = async (investorAddress?: string): Promise<any[]> => {
    if (!contract) return [];
  
    try {
      setIsLoading(true);
  
      // Use provided address or connected wallet address
      const owner = investorAddress || address;
  
      // Get all startups
      const startups = await getCampaigns();
  
      let allTokens: any[] = [];
  
      // For each startup, get the investor's tokens
      for (let i = 0; i < startups.length; i++) {
        try {
          const preparedCall = await readContract({
            contract,
            method: "function getInvestorTokens(address _investor, uint256 _startupId) view returns (uint256[])",
            params: [owner, BigInt(i)],
          });
  
          const tokens = preparedCall;
  
          // For each token, get its details
          for (let j = 0; j < tokens.length; j++) {
            try {
              const tokenId = tokens[j];
              
              // Get token URI
              const tokenURI = await readContract({
                contract,
                method: "function tokenURI(uint256 tokenId) view returns (string)",
                params: [tokenId],
              });
              
              // Handle different URI formats
              let jsonString;
              let metadata;
              
              try {
                // Check if it's a data URI with base64
                if (tokenURI.startsWith('data:application/json;base64,')) {
                  const base64Data = tokenURI.replace('data:application/json;base64,', '');
                  jsonString = atob(base64Data);
                } 
                // Check if it's an IPFS URI
                else if (tokenURI.startsWith('ipfs://')) {
                  const ipfsHash = tokenURI.replace('ipfs://', '');
                  const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
                  jsonString = await response.text();
                }
                // Check if it's a direct JSON string
                else if (tokenURI.startsWith('{')) {
                  jsonString = tokenURI;
                }
                // Check if it's a HTTP/HTTPS URL
                else if (tokenURI.startsWith('http')) {
                  const response = await fetch(tokenURI);
                  jsonString = await response.text();
                }
                // If none of the above, try to parse it directly
                else {
                  console.warn(`Unrecognized token URI format for token ${tokenId}: ${tokenURI}`);
                  jsonString = tokenURI;
                }
                
                // Parse the JSON
                try {
                  metadata = JSON.parse(jsonString);
                } catch (parseError) {
                  console.warn(`Failed to parse JSON for token ${tokenId}: ${parseError}`);
                  
                  // Try to extract JSON from the string if it contains a JSON object
                  const jsonMatch = jsonString.match(/{.*}/s);
                  if (jsonMatch) {
                    try {
                      metadata = JSON.parse(jsonMatch[0]);
                    } catch (extractError) {
                      console.error(`Failed to extract JSON from string: ${extractError}`);
                      continue;
                    }
                  } else {
                    continue;
                  }
                }
              } catch (uriError) {
                console.error(`Error processing URI for token ${tokenId}: ${uriError}`);
                
                // Try to get raw token data from contract if URI processing fails
                try {
                  // Get investment amount directly from contract
                  const investmentAmount = await readContract({
                    contract,
                    method: "function getInvestmentAmount(address _investor, uint256 _startupId) view returns (uint256)",
                    params: [owner, BigInt(i)],
                  });
                  
                  // Create minimal metadata
                  metadata = {
                    name: `Investment in ${startups[i].title}`,
                    description: `Investment certificate for ${startups[i].title}`,
                    attributes: [
                      { trait_type: "Investment Amount", value: `${investmentAmount.toString()} AVAX` },
                      { trait_type: "Investment Date", value: Math.floor(Date.now() / 1000).toString() }
                    ]
                  };
                } catch (fallbackError) {
                  console.error(`Failed to get fallback data: ${fallbackError}`);
                  continue;
                }
              }
              
              if (!metadata || !metadata.attributes) {
                console.warn(`Missing metadata attributes for token ${tokenId}`);
                continue;
              }
              
              // Extract attributes with fallbacks
              const amountAttribute = metadata.attributes.find((attr: any) => attr.trait_type === "Investment Amount");
              const equityAttribute = metadata.attributes.find((attr: any) => attr.trait_type === "Equity Percentage");
              const dateAttribute = metadata.attributes.find((attr: any) => attr.trait_type === "Investment Date");
              
              // Parse values with fallbacks
              // Inside getInvestorTokens function, replace the investment amount parsing section with this:

// Parse values with fallbacks
let investmentAmount = "0";
if (amountAttribute) {
  try {
    const amountValue = amountAttribute.value.toString();
    
    // Extract just the numeric part before "AVAX"
    if (amountValue.includes(' AVAX')) {
      investmentAmount = amountValue.split(' AVAX')[0].trim();
    } else if (amountValue.includes(' ')) {
      investmentAmount = amountValue.split(' ')[0].trim();
    } else {
      // If it's just a number without units
      investmentAmount = amountValue;
    }
    
    // Check if it's a BigInt or very large number
    const numValue = parseFloat(investmentAmount);
    
    // Log for debugging
    console.log(`Token ${tokenId} raw amount: ${amountValue}, parsed: ${numValue}`);
    
    if (isNaN(numValue)) {
      console.warn(`Invalid investment amount: ${amountValue}`);
      investmentAmount = "0";
    } else if (numValue > 1000000) {
      // If unreasonably large, it might be in wei - convert to AVAX
      const valueInAVAX = numValue / 10**18;
      console.log(`Converting large amount ${numValue} to AVAX: ${valueInAVAX}`);
      investmentAmount = valueInAVAX.toString();
    }
  } catch (error) {
    console.error(`Error parsing investment amount: ${error}`);
    investmentAmount = "0";
  }
}

// Similarly, update equity parsing if needed
let equity = "0";
if (equityAttribute) {
  try {
    const equityValue = equityAttribute.value.toString();
    equity = equityValue.includes('%') ? equityValue.replace('%', '') : equityValue;
    
    // Validate equity is a reasonable number
    const numEquity = parseFloat(equity);
    if (isNaN(numEquity)) {
      console.warn(`Invalid equity percentage: ${equityValue}`);
      equity = "0";
    } else if (numEquity > 100) {
      // If equity is unreasonably large, it might be in basis points (1% = 100 bp)
      console.log(`Converting large equity ${numEquity} to percentage: ${numEquity/100}`);
      equity = (numEquity / 100).toString();
    }
  } catch (error) {
    console.error(`Error parsing equity: ${error}`);
    equity = "0";
  }
}

              
              let investmentDate = new Date();
              if (dateAttribute) {
                try {
                  const timestamp = parseInt(dateAttribute.value);
                  if (!isNaN(timestamp)) {
                    investmentDate = new Date(timestamp * 1000);
                  }
                } catch (dateError) {
                  console.warn(`Invalid date format: ${dateAttribute.value}`);
                }
              }
              
              allTokens.push({
                tokenId: tokenId.toString(),
                startupId: i,
                startupName: startups[i].title,
                investmentAmount,
                investmentDate,
                equity,
                ownerAddress: owner,
                metadata
              });
            } catch (tokenError) {
              console.error(`Error processing token ${tokens[j]} for startup ${i}:`, tokenError);
            }
          }
        } catch (startupError) {
          console.error(`Error getting tokens for startup ${i}:`, startupError);
        }
      }
  
      return allTokens;
    } catch (error) {
      console.error("Error getting investor tokens:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // Create milestone for a startup
  const createMilestone = async (
    startupId: number,
    title: string,
    description: string,
    fundAmount: number
  ): Promise<void> => {
    if (!contract) return;
    
    try {
      setIsLoading(true);
      
      // Call contract function
      const preparedTx = await prepareContractCall({
        contract,
        method: "function addStartupMilestone(uint256 _id, string _title, string _description, uint256 _fundAmount)",
        params: [
          BigInt(startupId),
          title,
          description,
          toWei(fundAmount.toString())
        ],
      });
      
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });
      
      console.log("Milestone created successfully", tx);
    } catch (error) {
      console.error("Error creating milestone:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a milestone (only verifier can do this)
  const completeMilestone = async (
    startupId: number,
    milestoneId: number,
    proofFile: File
  ): Promise<void> => {
    if (!contract) return;
    
    try {
      setIsLoading(true);
      
      // Upload proof to IPFS
      const proofCid = await uploadToIPFS(proofFile);
      
      // Call contract function
      const preparedTx = await prepareContractCall({
        contract,
        method: "function completeMilestone(uint256 _startupId, uint256 _milestoneId, string _proofIpfsHash)",
        params: [
          BigInt(startupId),
          BigInt(milestoneId),
          proofCid
        ],
      });
      
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });
      
      console.log("Milestone completed successfully", tx);
    } catch (error) {
      console.error("Error completing milestone:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get milestones for a startup
  const getStartupMilestones = async (startupId: number): Promise<any[]> => {
    if (!contract) return [];
    
    try {
      setIsLoading(true);
      
      // Call contract function
      const milestones = await readContract({
        contract,
        method: "function getStartupMilestones(uint256 _id) view returns ((string title, string description, uint256 fundAmount, bool isCompleted, string ipfsHash, uint256 completionTimestamp)[])",
        params: [BigInt(startupId)],
      });
      
      // Format milestones
      const formattedMilestones = milestones.map((milestone: any, index: number) => {
        // Determine status based on isCompleted
        const status = milestone.isCompleted ? "Completed" : "In Progress";
        
        return {
          id: index,
          startupId: startupId,
          title: milestone.title,
          description: milestone.description,
          fundAmount: formatEther(milestone.fundAmount.toString()),
          status,
          isCompleted: milestone.isCompleted,
          proofIpfsHash: milestone.ipfsHash,
          completionDate: milestone.completionTimestamp > 0
            ? new Date(Number(milestone.completionTimestamp) * 1000)
            : undefined,
        };
      });
      
      return formattedMilestones;
    } catch (error) {
      console.error("Error getting startup milestones:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Verify a startup (only verifier can do this)
  const verifyStartup = async (startupId: number): Promise<void> => {
    if (!contract) return;
    
    try {
      setIsLoading(true);
      
      // Call contract function
      const preparedTx = await prepareContractCall({
        contract,
        method: "function verifyStartup(uint256 _id)",
        params: [BigInt(startupId)],
      });
      
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });
      
      console.log("Startup verified successfully", tx);
    } catch (error) {
      console.error("Error verifying startup:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is a verifier
  const isVerifier = async (): Promise<boolean> => {
    if (!contract || !address) return false;
    
    try {
      const verifierAddress = await readContract({
        contract,
        method: "function verifier() view returns (address)",
        params: [],
      });
      
      return verifierAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error("Error checking if user is verifier:", error);
      return false;
    }
  };

  // Check if user has invested in a startup
  const hasInvestedInStartup = async (startupId: number): Promise<boolean> => {
    if (!contract || !address) return false;
    
    try {
      const result = await readContract({
        contract,
        method: "function hasInvestmentIn(address _investor, uint256 _startupId) view returns (bool)",
        params: [address, BigInt(startupId)],
      });
      
      return result;
    } catch (error) {
      console.error("Error checking if user has invested:", error);
      return false;
    }
  };

  // Get investment amount for a user in a startup
  const getInvestmentAmount = async (startupId: number): Promise<string> => {
    if (!contract || !address) return "0";
    
    try {
      const amount = await readContract({
        contract,
        method: "function getInvestmentAmount(address _investor, uint256 _startupId) view returns (uint256)",
        params: [address, BigInt(startupId)],
      });
      
      return formatEther(amount.toString());
    } catch (error) {
      console.error("Error getting investment amount:", error);
      return "0";
    }
  };

  // Refund investment if funding target not met
  const refundInvestment = async (startupId: number): Promise<void> => {
    if (!contract) return;
    
    try {
      setIsLoading(true);
      
      // Call contract function
      const preparedTx = await prepareContractCall({
        contract,
        method: "function refundInvestment(uint256 _startupId)",
        params: [BigInt(startupId)],
      });
      
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });
      
      console.log("Investment refunded successfully", tx);
    } catch (error) {
      console.error("Error refunding investment:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add document to a loan
  const addLoanDocument = async (loanId: number, file: File, documentType: string): Promise<string> => {
    if (!contract) return "";
    
    try {
      setIsLoading(true);
      
      // Upload file to IPFS
      const cid = await uploadToIPFS(file);
      
      // Call contract function
      const preparedTx = await prepareContractCall({
        contract,
        method: "function addLoanDocument(uint256 _id, string _ipfsHash, string _documentType)",
        params: [BigInt(loanId), cid, documentType],
      });
      
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });
      
      console.log(`Document uploaded for loan ${loanId}: ${file.name} (${documentType})`, tx);
      
      // Return the document CID
      return cid;
    } catch (error) {
      console.error("Error uploading loan document:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get documents for a loan
  const getLoanDocuments = async (loanId: number): Promise<any[]> => {
    if (!contract) return [];
    
    try {
      setIsLoading(true);
      
      // Call contract function
      const documents = await readContract({
        contract,
        method: "function getLoanDocuments(uint256 _id) view returns ((string ipfsHash, string documentType, uint256 timestamp)[])",
        params: [BigInt(loanId)],
      });
      
      // Format documents
      const formattedDocuments = documents.map((doc: any) => {
        return {
          ipfsHash: doc.ipfsHash,
          documentType: doc.documentType,
          timestamp: new Date(Number(doc.timestamp) * 1000),
          url: getIPFSGatewayURL(doc.ipfsHash),
          metadata: {
            name: `Document-${doc.documentType}`,
            type: doc.documentType,
            cid: doc.ipfsHash,
          }
        };
      });
      
      return formattedDocuments;
    } catch (error) {
      console.error("Error getting loan documents:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        account,
        connect,
        createStartupCampaign,
        applyForLoan,
        lendLoan,
        getCampaigns,
        getLoanRequests,
        withdrawStartupFunds,
        fundStartup,
        withdrawLoanFunds,
        repayLoan,
        
        // Add these new properties
        uploadDocument,
        getStartupDocuments,
        isLoading,
        
        // Add other new functions
        getInvestorTokens,
        createMilestone,
        completeMilestone,
        getStartupMilestones,
        verifyStartup,
        isVerifier,
        hasInvestedInStartup,
        getInvestmentAmount,
        refundInvestment,
        addLoanDocument,
        getLoanDocuments,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};