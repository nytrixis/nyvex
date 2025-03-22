"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useStateContext } from "@/context";
import { Button } from "@/components/ui/button";
import { Loader2 as LoaderIcon, DollarSign, Clock, User, FileText, ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/component/Footer";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" }),
  purpose: z.string().min(1, { message: "Purpose is required" }).max(500, { message: "Purpose must be less than 500 characters" }),
  name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  duration: z
    .string()
    .min(1, { message: "Duration is required" })
    .refine(
      (value) => {
        const parsedValue = parseInt(value, 10);
        return !isNaN(parsedValue) && Number.isInteger(parsedValue) && parsedValue > 0;
      },
      {
        message: "Duration must be a positive integer",
      }
    ),
});

const RequestLoan = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      purpose: "",
      name: "",
      duration: "",
    },
  });

  const { applyForLoan } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await applyForLoan(
        data.amount,
        data.purpose,
        data.name,
        parseInt(data.duration)
      );
      setFormStep(1); // Move to success step
    } catch (error) {
      console.error("Failed to request loan", error);
      setFormStep(2); // Move to error step
    } finally {
      setLoading(false);
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-[#1a2942]">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Request a <span className="text-[#00E6E6]">Loan</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Fill out the form below to request funding for your next venture
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl"
          >
            <Button
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => router.push("/loans")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Loans
            </Button>

            {formStep === 0 && (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="px-6 border-b border-slate-700">
                  <CardTitle className="text-white">Loan Request Form</CardTitle>
                  <CardDescription className="text-slate-400">
                    Provide details about your loan request
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-2">
                                <User size={16} className="text-[#00E6E6]" />
                                Your Name
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  {...field} 
                                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#00E6E6] focus:ring-[#00E6E6]/20"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-2">
                                <DollarSign size={16} className="text-[#00E6E6]" />
                                Loan Amount (AVAX)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter amount in AVAX" 
                                  {...field} 
                                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#00E6E6] focus:ring-[#00E6E6]/20"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-2">
                                <Clock size={16} className="text-[#00E6E6]" />
                                Duration (months)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter loan duration in months"
                                  {...field}
                                  type="number"
                                  min="1"
                                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#00E6E6] focus:ring-[#00E6E6]/20"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-2">
                                <FileText size={16} className="text-[#00E6E6]" />
                                Loan Purpose
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  placeholder="Describe how you plan to use the loan"
                                  {...field}
                                  rows={4}
                                  className="w-full rounded-md bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-[#00E6E6] focus:ring-[#00E6E6]/20 p-3"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex flex-col space-y-2 text-sm text-slate-400 mb-6">
                          <p>By submitting this request:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>You agree to repay the loan with 10% interest</li>
                            <li>Your request will be visible to all potential lenders</li>
                            <li>Funds will be transferred once the full amount is raised</li>
                          </ul>
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                        >
                          {loading ? (
                            <>
                              <LoaderIcon className="animate-spin mr-2" size={16} />
                              Processing Request...
                            </>
                          ) : (
                            "Submit Loan Request"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {formStep === 1 && (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Loan Request Submitted!</h2>
                  <p className="text-slate-300 mb-6">
                    Your loan request has been successfully submitted to the blockchain. Potential lenders can now view and fund your request.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => router.push("/loans")}
                      className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                    >
                      View All Loans
                    </Button>
                    <Button
                      onClick={() => setFormStep(0)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Create Another Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {formStep === 2 && (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Something Went Wrong</h2>
                  <p className="text-slate-300 mb-6">
                    We could not process your loan request. This might be due to a network issue or insufficient wallet balance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setFormStep(0)}
                      className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => router.push("/loans")}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Back to Loans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">How It Works</CardTitle>
              <CardDescription className="text-slate-400">
                Understanding the loan process on NyveX
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              <ol className="space-y-3 list-decimal pl-5">
                <li>Submit your loan request with details about amount, purpose, and duration</li>
                <li>Lenders review your request and contribute funds</li>
                <li>Once fully funded, you can withdraw the loan amount</li>
                <li>Repay the loan with 10% interest within the specified duration</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">Loan Terms</CardTitle>
              <CardDescription className="text-slate-400">
                Important information about our loan terms
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Interest Rate:</strong> Fixed 10% interest on all loans</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Funding Period:</strong> No time limit, funds available when fully funded</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Security:</strong> All transactions secured by blockchain smart contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Transparency:</strong> All loan details visible to the community</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RequestLoan;

