"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Search, Filter, Info, DollarSign, Clock, User, FileText } from "lucide-react";
import { useStateContext } from "@/context";
import { useRouter } from "next/navigation";
import Footer from "@/components/component/Footer";

interface Lender {
  address: string;
  amount: number;
}

interface Loan {
  name: string;
  amount: number;
  duration: number | bigint;
  amountCollected: number;
  repaid: boolean;
  requester: string;
  address: string;
  purpose: string;
  lenders: Lender[];
  lId: number;
}

type SortOrder = "asc" | "desc";

export default function LoansPage() {
  const router = useRouter();
  const { getLoanRequests, lendLoan, address, withdrawLoanFunds, repayLoan } = useStateContext();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [sortOrder, setSortOrder] = useState<{
    key: keyof Loan;
    order: SortOrder;
  }>({
    key: "name",
    order: "asc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "repaid" | "pending">("all");

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

  // Fetch loans from the blockchain when the component mounts
  useEffect(() => {
    async function fetchLoans() {
      setIsLoading(true);
      try {
        const loanData = await getLoanRequests();
        setLoans(loanData);
        setFilteredLoans(loanData);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLoans();
  }, [getLoanRequests]);

  // Filter loans based on search term and status filter
  useEffect(() => {
    let result = loans;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(loan => 
        loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(loan => 
        statusFilter === "repaid" ? loan.repaid : !loan.repaid
      );
    }
    
    setFilteredLoans(result);
  }, [searchTerm, statusFilter, loans]);

  const sortLoans = (key: keyof Loan) => {
    const newOrder = sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc";
    const sortedLoans = [...filteredLoans].sort((a, b) => {
      if (typeof a[key] === "string") {
        return newOrder === "asc"
          ? (a[key] as string).localeCompare(b[key] as string)
          : (b[key] as string).localeCompare(a[key] as string);
      }
      // Handle BigInt comparison
      if (typeof a[key] === "bigint") {
        return newOrder === "asc"
          ? (a[key] as bigint) < (b[key] as bigint)
            ? -1
            : 1
          : (a[key] as bigint) > (b[key] as bigint)
          ? -1
          : 1;
      }
      return newOrder === "asc"
        ? (a[key] as number) - (b[key] as number)
        : (b[key] as number) - (a[key] as number);
    });
    setFilteredLoans(sortedLoans);
    setSortOrder({ key, order: newOrder });
  };

  const renderSortIcon = (key: keyof Loan) => {
    if (sortOrder.key !== key) return null;
    return sortOrder.order === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  const handleLend = async (loanId: number, amount: string) => {
    try {
      await lendLoan(loanId, amount);
      // Refresh loans after lending
      const updatedLoans = await getLoanRequests();
      setLoans(updatedLoans);
      setFilteredLoans(updatedLoans);
    } catch (error) {
      console.error("Error lending to loan:", error);
    }
  };

  const handleRepay = async (loanId: number, amount: string) => {
    try {
      await repayLoan(loanId, amount);
      // Refresh loans after repaying
      const updatedLoans = await getLoanRequests();
      setLoans(updatedLoans);
      setFilteredLoans(updatedLoans);
    } catch (error) {
      console.error("Error repaying loan:", error);
    }
  };

  const handleWithdraw = async (loanId: number) => {
    try {
      await withdrawLoanFunds(loanId);
      // Refresh loans after withdrawal
      const updatedLoans = await getLoanRequests();
      setLoans(updatedLoans);
      setFilteredLoans(updatedLoans);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
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
            Loan <span className="text-[#00E6E6]">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover loan opportunities or request funding for your next venture
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
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00E6E6] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
              <Filter size={18} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "repaid" | "pending")}
                className="bg-transparent text-white focus:outline-none"
              >
                <option value="all" className="bg-slate-800">All Loans</option>
                <option value="repaid" className="bg-slate-800">Repaid</option>
                <option value="pending" className="bg-slate-800">Pending</option>
              </select>
            </div>

            <Button
              onClick={() => router.push("/loans/request-loan")}
              className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
            >
              Request Loan
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-6 border-b border-slate-700">
              <CardTitle className="text-white">Active Loan Requests</CardTitle>
              <CardDescription className="text-slate-400">
                Browse and interact with available loan opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E6E6]"></div>
                </div>
              ) : filteredLoans.length === 0 ? (
                <div className="text-center text-slate-400 py-16">
                  <Info className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                  <h3 className="text-xl font-semibold mb-2 text-white">No loans found</h3>
                  <p>There are no loans matching your criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-800/80">
                        <TableHead
                          onClick={() => sortLoans("name")}
                          className="cursor-pointer text-slate-300 hover:text-white"
                        >
                          <div className="flex items-center">
                            <span>Name</span>
                            {renderSortIcon("name")}
                          </div>
                        </TableHead>
                        <TableHead
                          onClick={() => sortLoans("amount")}
                          className="cursor-pointer text-slate-300 hover:text-white"
                        >
                          <div className="flex items-center">
                            <span>Amount</span>
                            {renderSortIcon("amount")}
                          </div>
                        </TableHead>
                        <TableHead
                          onClick={() => sortLoans("duration")}
                          className="cursor-pointer text-slate-300 hover:text-white"
                        >
                          <div className="flex items-center">
                            <span>Duration</span>
                            {renderSortIcon("duration")}
                          </div>
                        </TableHead>
                        <TableHead className="text-slate-300">Collected</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLoans.map((loan, index) => (
                        <TableRow 
                          key={index} 
                          className="border-slate-700 hover:bg-slate-800/80"
                        >
                          <TableCell className="font-medium text-white">
                            {loan.name}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-1">
                              <DollarSign size={16} className="text-[#00E6E6]" />
                              {loan.amount.toLocaleString()} AVAX
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-1">
                              <Clock size={16} className="text-[#00E6E6]" />
                              {Number(loan.duration)} months
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-slate-300">
                                {loan.amountCollected > 0
                                  ? loan.amountCollected.toLocaleString() + " AVAX"
                                  : "0 AVAX"}
                              </span>
                              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-[#00E6E6] h-1.5 rounded-full" 
                                  style={{ 
                                    width: `${Math.min(100, (loan.amountCollected / loan.amount) * 100)}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={loan.repaid ? "secondary" : "destructive"}
                              className={`text-xs ${loan.repaid ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}
                            >
                              {loan.repaid ? "Repaid" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-800 border border-slate-700 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-white">{loan.name}</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                      Loan ID: {loan.lId}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-400 mb-1">Amount</p>
                                        <p className="text-lg font-medium text-white">{loan.amount.toLocaleString()} AVAX</p>
                                      </div>
                                      <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-400 mb-1">Duration</p>
                                        <p className="text-lg font-medium text-white">{Number(loan.duration)} months</p>
                                      </div>
                                      <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-400 mb-1">Collected</p>
                                        <p className="text-lg font-medium text-white">{loan.amountCollected.toLocaleString()} AVAX</p>
                                      </div>
                                      <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-400 mb-1">Status</p>
                                        <Badge
                                          variant={loan.repaid ? "secondary" : "destructive"}
                                          className={`text-xs ${loan.repaid ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}
                                        >
                                          {loan.repaid ? "Repaid" : "Pending"}
                                        </Badge>
                                      </div>
                                    </div>
  
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <User size={16} className="text-[#00E6E6]" />
                                        <p className="font-medium text-white">Requester</p>
                                      </div>
                                      <div className="bg-slate-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-slate-300 break-all">{loan.requester}</p>
                                      </div>
                                    </div>
  
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-[#00E6E6]" />
                                        <p className="font-medium text-white">Purpose</p>
                                      </div>
                                      <div className="bg-slate-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-slate-300">{loan.purpose}</p>
                                      </div>
                                    </div>
  
                                    {loan.lenders.length > 0 && (
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                          </svg>
                                          <p className="font-medium text-white">Lenders</p>
                                        </div>
                                        <div className="bg-slate-700/50 p-3 rounded-lg max-h-40 overflow-y-auto">
                                          <div className="space-y-2">
                                            {loan.lenders.map((lender, lenderIndex) => (
                                              <div
                                                key={lenderIndex}
                                                className="flex items-center justify-between border-b border-slate-600 last:border-0 pb-2 last:pb-0"
                                              >
                                                <div className="font-medium text-slate-300 text-sm">
                                                  {lender.address.substring(0, 6)}...{lender.address.substring(lender.address.length - 4)}
                                                </div>
                                                <div className="text-[#00E6E6] text-sm">{lender.amount.toLocaleString()} AVAX</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                    {loan.requester !== address ? (
                                      <Button
                                        onClick={() => handleLend(loan.lId, loan.amount.toString())}
                                        className="w-full sm:w-auto bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                                        disabled={loan.repaid || loan.amountCollected >= loan.amount}
                                      >
                                        Lend {loan.amount.toLocaleString()} AVAX
                                      </Button>
                                    ) : (
                                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                                        <Button
                                          onClick={() => handleRepay(
                                            loan.lId,
                                            (Number(loan.amount) + Number(loan.amount / 10)).toString()
                                          )}
                                          className="w-full sm:w-auto bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                                          disabled={loan.repaid || loan.amountCollected < loan.amount}
                                        >
                                          Repay Loan
                                        </Button>
                                        <Button
                                          onClick={() => handleWithdraw(loan.lId)}
                                          className="w-full sm:w-auto border border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6]/10 transition-colors"
                                          disabled={loan.repaid || loan.amountCollected < loan.amount}
                                        >
                                          Withdraw Funds
                                        </Button>
                                      </div>
                                    )}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
  
          {/* Loan Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full"
          >
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                  <DollarSign size={24} className="text-[#00E6E6]" />
                </div>
                <CardTitle className="text-white">Competitive Rates</CardTitle>
                <CardDescription className="text-slate-400">
                  Our platform offers transparent and competitive interest rates for both lenders and borrowers.
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
                <CardTitle className="text-white">Secure Transactions</CardTitle>
                <CardDescription className="text-slate-400">
                  All loans are secured by smart contracts on the blockchain, ensuring transparency and security.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-white">Fast Funding</CardTitle>
                <CardDescription className="text-slate-400">
                  Get your loan funded quickly without the lengthy approval processes of traditional banking.
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E6E6]/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
              <CardContent className="p-8 md:p-12 relative">
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Need funding for your next venture?
                  </h3>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                    Create a loan request and get funded by our community of investors. Our platform makes it easy to access the capital you need.
                  </p>
                  <Button 
                    onClick={() => router.push("/loans/request-loan")}
                    className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors px-8 py-6 text-lg"
                  >
                    Request a Loan
                  </Button>
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
  