"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStateContext } from "@/context";
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  User, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Users,
  ExternalLink,
  ArrowUpRight
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Footer from "@/components/component/Footer";

interface Lender {
  funderAddress: string;
  amount: number;
  tokenId?: number;
}

interface Document {
  ipfsHash: string;
  documentType: string;
  timestamp: number;
  name?: string;
  url?: string;
  type?: string;
  uploadDate?: Date;
}

interface LoanDetail {
  requester: string;
  name: string;
  purpose: string;
  amount: number;
  duration: number | bigint;
  amountCollected: number;
  lenders: Lender[];
  documentHashes: Document[];
  repaid: boolean;
  lId: number;
  address?: string;
}

export default function LoanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    getLoanRequests, 
    address, 
    lendLoan, 
    withdrawLoanFunds, 
    repayLoan,
    getLoanDocuments,
    addLoanDocument
  } = useStateContext();

  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequester, setIsRequester] = useState(false);
  const [isLender, setIsLender] = useState(false);
  const [lendAmount, setLendAmount] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("financial_statement");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [processingAction, setProcessingAction] = useState(false);
  const [repaymentSchedule, setRepaymentSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const loanRequests = await getLoanRequests();
        const loanData = loanRequests[parseInt(id as string)];
        
        if (!loanData) {
          router.push("/loans");
          return;
        }
        
        setLoan(loanData);
        setIsRequester(loanData.requester === address);
        
        // Check if user is a lender
        const userIsLender = loanData.lenders.some(
          (lender: Lender) => lender.funderAddress === address
        );
        setIsLender(userIsLender);
        
        // Get documents
        const docs = await getLoanDocuments(parseInt(id as string));
        setDocuments(docs);
        
        // Generate repayment schedule
        generateRepaymentSchedule(loanData);
      } catch (error) {
        console.error("Error fetching loan details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && address) {
      fetchData();
    }
  }, [id, getLoanRequests, address, getLoanDocuments, router]);

  const generateRepaymentSchedule = (loanData: LoanDetail) => {
    if (!loanData) return;
    
    const loanAmount = loanData.amount;
    const durationMonths = Number(loanData.duration);
    const interestRate = 0.1; // 10% interest rate
    
    const totalRepayment = loanAmount + (loanAmount * interestRate);
    const monthlyPayment = totalRepayment / durationMonths;
    
    const schedule = [];
    let remainingBalance = totalRepayment;
    const startDate = new Date();
    
    for (let i = 1; i <= durationMonths; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);
      
      remainingBalance -= monthlyPayment;
      
      schedule.push({
        month: i,
        paymentDate,
        payment: monthlyPayment,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
    
    setRepaymentSchedule(schedule);
  };

  const handleLendLoan = async () => {
    if (!lendAmount || !loan) return;
    
    setProcessingAction(true);
    try {
      await lendLoan(loan.lId, lendAmount);
      // Refresh data after lending
      const loanRequests = await getLoanRequests();
      setLoan(loanRequests[parseInt(id as string)]);
      setIsLender(true);
      setLendAmount("");
    } catch (error) {
      console.error("Error lending to loan:", error);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRepayLoan = async () => {
    if (!loan) return;
    
    setProcessingAction(true);
    try {
      // Calculate repayment amount (principal + 10% interest)
      const repaymentAmount = (Number(loan.amount) + Number(loan.amount / 10)).toString();
      await repayLoan(loan.lId, repaymentAmount);
      // Refresh data after repayment
      const loanRequests = await getLoanRequests();
      setLoan(loanRequests[parseInt(id as string)]);
    } catch (error) {
      console.error("Error repaying loan:", error);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleWithdrawFunds = async () => {
    if (!loan) return;
    
    setProcessingAction(true);
    try {
      await withdrawLoanFunds(loan.lId);
      // Refresh data after withdrawal
      const loanRequests = await getLoanRequests();
      setLoan(loanRequests[parseInt(id as string)]);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!docFile || !loan) return;
    
    setUploadingDoc(true);
    try {
      await addLoanDocument(loan.lId, docFile, docType);
      // Refresh documents
      const docs = await getLoanDocuments(parseInt(id as string));
      setDocuments(docs);
      setDocFile(null);
      setDocType("financial_statement");
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-[#1a2942]">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E6E6]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-[#1a2942]">
        <div className="container mx-auto py-16 px-4 text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-white">Loan Not Found</h1>
          <p className="text-slate-400 mb-6">The loan you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/loans")} className="bg-[#00E6E6] text-black hover:bg-[#00d1d1]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
          </Button>
        </div>
      </div>
    );
  }

  // Calculate funding progress
  const fundingProgress = Math.min(
    (loan.amountCollected / loan.amount) * 100,
    100
  );
  const fundingComplete = fundingProgress >= 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-[#1a2942]">
      <div className="container mx-auto py-8 px-4">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => router.push("/loans")}
            className="flex items-center text-slate-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
          </Button>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">{loan.name}</h1>
              <p className="text-lg text-slate-400">{loan.purpose}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {isRequester && (
                <Badge className="bg-[#1a2942] text-white px-3 py-1">
                  <User className="mr-1 h-4 w-4" /> Requester
                </Badge>
              )}
              
              {isLender && (
                <Badge className="bg-[#00E6E6] text-black px-3 py-1">
                  <CheckCircle className="mr-1 h-4 w-4" /> Lender
                </Badge>
              )}
              
              {loan.repaid ? (
                <Badge className="bg-green-500/20 text-green-400 px-3 py-1">
                  <CheckCircle className="mr-1 h-4 w-4" /> Repaid
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-400 px-3 py-1">
                  <Clock className="mr-1 h-4 w-4" /> Pending
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Loan Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">Loan Details</CardTitle>
                  <CardDescription className="text-slate-400">
                    Comprehensive information about this loan request
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Loan Amount</p>
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-[#00E6E6] mr-1" />
                          <p className="text-xl font-bold text-white">{loan.amount.toLocaleString()} AVAX</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Duration</p>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-[#00E6E6] mr-1" />
                          <p className="text-xl font-bold text-white">{Number(loan.duration)} months</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Interest Rate</p>
                        <div className="flex items-center">
                          <ArrowUpRight className="h-5 w-5 text-[#00E6E6] mr-1" />
                          <p className="text-xl font-bold text-white">10%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Collected Amount</p>
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-[#00E6E6] mr-1" />
                          <p className="text-xl font-bold text-white">{loan.amountCollected.toLocaleString()} AVAX</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Status</p>
                        <div className="flex items-center">
                          {loan.repaid ? (
                            <Badge className="bg-green-500/20 text-green-400">Repaid</Badge>
                          ) : fundingComplete ? (
                            <Badge className="bg-blue-500/20 text-blue-400">Fully Funded</Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-400">Funding in Progress</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Total Repayment</p>
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-[#00E6E6] mr-1" />
                          <p className="text-xl font-bold text-white">
                            {(loan.amount + (loan.amount * 0.1)).toLocaleString()} AVAX
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-3">Funding Progress</p>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-4 bg-[#00E6E6]"
                          style={{ width: `${fundingProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{fundingProgress.toFixed(1)}% Funded</span>
                        <span className="text-slate-400">{loan.amount.toLocaleString()} AVAX Goal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Repayment Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">Repayment Schedule</CardTitle>
                  <CardDescription className="text-slate-400">
                    Monthly payment plan for this loan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/80">
                          <TableHead className="text-slate-400">Month</TableHead>
                          <TableHead className="text-slate-400">Payment Date</TableHead>
                          <TableHead className="text-slate-400">Payment Amount</TableHead>
                          <TableHead className="text-slate-400">Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {repaymentSchedule.map((payment, index) => (
                          <TableRow key={index} className="border-slate-700 hover:bg-slate-800/80">
                            <TableCell className="font-medium text-white">{payment.month}</TableCell>
                            <TableCell className="text-slate-300">
                              {payment.paymentDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {payment.payment.toFixed(2)} AVAX
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {payment.remainingBalance.toFixed(2)} AVAX
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documents Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700">
                  <div>
                    <CardTitle className="text-white">Documents</CardTitle>
                    <CardDescription className="text-slate-400">
                      Financial statements and supporting documents
                    </CardDescription>
                  </div>
                  
                  {isRequester && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#00E6E6] text-black hover:bg-[#00d1d1]">
                          <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Upload Document</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Add supporting documents for your loan request
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Document Type</label>
                            <select 
                              className="w-full p-2 rounded-md border border-slate-700 bg-slate-800 text-white"
                              value={docType}
                              onChange={(e) => setDocType(e.target.value)}
                            >
                              <option value="financial_statement">Financial Statement</option>
                              <option value="income_proof">Income Proof</option>
                              <option value="business_plan">Business Plan</option>
                              <option value="credit_report">Credit Report</option>
                              <option value="collateral_document">Collateral Document</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              id="doc-file"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <label 
                              htmlFor="doc-file" 
                              className="cursor-pointer flex flex-col items-center justify-center"
                            >
                              {docFile ? (
                                <>
                                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                  <p className="text-sm font-medium text-white">{docFile.name}</p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {(docFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                  <p className="text-sm font-medium text-white">Click to upload document</p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    PDF, DOC, DOCX, XLS, XLSX
                                  </p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            onClick={handleUploadDocument}
                            disabled={!docFile || uploadingDoc}
                            className="bg-[#00E6E6] text-black hover:bg-[#00d1d1]"
                          >
                            {uploadingDoc ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                            ) : (
                              "Upload Document"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  {documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-md border border-slate-700 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#00E6E6]" />
                            <div>
                              <p className="font-medium text-white">{doc.name || `Document ${index + 1}`}</p>
                              <p className="text-xs text-slate-400">
                                {doc.documentType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} • 
                                {doc.timestamp ? new Date(doc.timestamp * 1000).toLocaleDateString() : 'Unknown date'}
                              </p>
                            </div>
                          </div>
                          <a 
                            href={doc.url || `https://ipfs.io/ipfs/${doc.ipfsHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#00E6E6] hover:underline flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-500 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-400">No documents have been uploaded yet.</p>
                      {isRequester && (
                        <p className="text-sm mt-2 text-slate-500">
                          Upload financial statements and other documents to provide more information to potential lenders.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Loan Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">Loan Actions</CardTitle>
                  <CardDescription className="text-slate-400">
                    Interact with this loan request
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {!isRequester && !loan.repaid && !fundingComplete && (
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className="w-full bg-[#00E6E6] text-black hover:bg-[#00d1d1]">
                            <DollarSign className="mr-2 h-4 w-4" /> Lend Now
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-slate-800 border border-slate-700 text-white">
                          <div className="space-y-4">
                            <h4 className="font-medium text-white">Lend to {loan.name}</h4>
                            <p className="text-sm text-slate-400">
                              Enter the amount you want to lend in AVAX
                            </p>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-white">Amount (AVAX)</label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={lendAmount}
                                onChange={(e) => setLendAmount(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <Button 
                              onClick={handleLendLoan}
                              disabled={!lendAmount || processingAction}
                              className="w-full bg-[#00E6E6] text-black hover:bg-[#00d1d1]"
                            >
                              {processingAction ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                              ) : (
                                "Confirm Lending"
                              )}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {isRequester && fundingComplete && !loan.repaid && (
                    <div className="space-y-4">
                      <Button 
                        onClick={handleWithdrawFunds}
                        disabled={processingAction}
                        className="w-full bg-[#00E6E6] text-black hover:bg-[#00d1d1]"
                      >
                        {processingAction ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                        ) : (
                          "Withdraw Funds"
                        )}
                        </Button>
                        
                        <div className="p-3 bg-slate-700/50 rounded-md">
                          <p className="text-sm text-slate-300">
                            By withdrawing funds, you agree to repay the loan with 10% interest within {Number(loan.duration)} months.
                          </p>
                        </div>
                      </div>
                    )}
  
                    {isRequester && !loan.repaid && loan.amountCollected > 0 && (
                      <div className="space-y-4">
                        <Button 
                          onClick={handleRepayLoan}
                          disabled={processingAction}
                          className="w-full border border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6]/10"
                        >
                          {processingAction ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#00E6E6]"></div>
                          ) : (
                            "Repay Loan"
                          )}
                        </Button>
                        
                        <div className="p-3 bg-slate-700/50 rounded-md">
                          <p className="text-sm text-slate-300">
                            Repayment amount: {(loan.amount + (loan.amount * 0.1)).toLocaleString()} AVAX (principal + 10% interest)
                          </p>
                        </div>
                      </div>
                    )}
  
                    {loan.repaid && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <p className="font-medium text-green-400">Loan Repaid</p>
                        </div>
                        <p className="text-sm text-slate-300">
                          This loan has been fully repaid with interest.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
  
              {/* Requester Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-white">Requester Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Requester Address</p>
                      <p className="font-medium text-white break-all">{loan.requester}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-sm text-slate-400 mb-2">Loan Purpose</p>
                      <div className="p-3 bg-slate-700/50 rounded-md">
                        <p className="text-white">{loan.purpose}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
  
              {/* Lenders List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-white">Lenders</CardTitle>
                    <CardDescription className="text-slate-400">
                      People who have funded this loan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {loan.lenders && loan.lenders.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {loan.lenders
                          .sort((a: Lender, b: Lender) => parseFloat(b.amount.toString()) - parseFloat(a.amount.toString()))
                          .map((lender: Lender, index: number) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="bg-[#1a2942] h-8 w-8 rounded-full flex items-center justify-center text-[#00E6E6]">
                                  {index + 1}
                                </div>
                                <p className="font-medium text-white truncate max-w-[120px]">
                                  {lender.funderAddress.substring(0, 6)}...{lender.funderAddress.substring(lender.funderAddress.length - 4)}
                                </p>
                              </div>
                              <p className="font-mono text-slate-300">{parseFloat(lender.amount.toString()).toFixed(2)} AVAX</p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-50" />
                        <p className="text-slate-400">No lenders yet</p>
                        <p className="text-sm mt-1 text-slate-500">Be the first to lend to this loan request!</p>
                      </div>
                    )}
                  </CardContent>
                  {loan.lenders && loan.lenders.length > 5 && (
                    <CardFooter className="border-t border-slate-700 pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                            View All Lenders
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border border-slate-700 text-white">
                          <DialogHeader>
                            <DialogTitle>All Lenders</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Complete list of lenders for {loan.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="max-h-[60vh] overflow-y-auto pr-2">
                            <div className="space-y-3">
                              {loan.lenders
                                .sort((a: Lender, b: Lender) => parseFloat(b.amount.toString()) - parseFloat(a.amount.toString()))
                                .map((lender: Lender, index: number) => (
                                  <div 
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-md hover:bg-slate-700/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="bg-[#1a2942] h-8 w-8 rounded-full flex items-center justify-center text-[#00E6E6]">
                                        {index + 1}
                                      </div>
                                      <p className="font-medium text-white break-all">{lender.funderAddress}</p>
                                    </div>
                                    <p className="font-mono text-slate-300">{parseFloat(lender.amount.toString()).toFixed(2)} AVAX</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
  
              {/* Loan Terms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-white">Loan Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-700/50 rounded-md">
                        <p className="text-sm text-white">
                          <span className="font-medium">Interest Rate:</span> 10% fixed rate
                        </p>
                      </div>
                      
                      <div className="p-3 bg-slate-700/50 rounded-md">
                        <p className="text-sm text-white">
                          <span className="font-medium">Repayment Period:</span> {Number(loan.duration)} months
                        </p>
                      </div>
                      
                      <div className="p-3 bg-slate-700/50 rounded-md">
                        <p className="text-sm text-white">
                          <span className="font-medium">Early Repayment:</span> Allowed with no penalties
                        </p>
                      </div>
                      
                      <div className="p-3 bg-slate-700/50 rounded-md">
                        <p className="text-sm text-white">
                          <span className="font-medium">Late Payment:</span> Additional fees may apply
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
  
          {/* Related Loans Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">You Might Also Be Interested In</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated with actual related loans */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white">Example Loan {i}</CardTitle>
                    <CardDescription className="text-slate-400">Business Expansion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount</span>
                        <span className="font-medium text-white">1,000 AVAX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration</span>
                        <span className="font-medium text-white">12 months</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#00E6E6] h-2 rounded-full" style={{ width: `${30 * i}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{30 * i}% Funded</span>
                        <span className="text-slate-400">1,000 AVAX Goal</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-slate-700 pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                      onClick={() => router.push(`/loans/${i}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  }
  