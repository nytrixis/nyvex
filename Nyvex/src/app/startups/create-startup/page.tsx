"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useStateContext } from "@/context";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 as LoaderIcon, X, Plus, Upload, Link as LinkIcon, Users, Percent, Target, Calendar as CalendarIconAlt, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Footer from "@/components/component/Footer";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(50, { message: "Description should be at least 50 characters" }),
  target: z.string().min(1, { message: "Funding target is required" }),
  deadline: z.date().refine((date) => date.getTime() > Date.now(), {
    message: "Deadline must be a future date",
  }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  video: z.string().url({ message: "Please enter a valid video URL" }),
  equityHolders: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      percentage: z.string().min(1, { message: "Percentage is required" }),
    })
  ).min(1, { message: "At least one equity holder is required" }),
});

const CreateStartup = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      target: "",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      image: "",
      video: "",
      equityHolders: [{ name: "", percentage: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "equityHolders",
  });

  const { createStartupCampaign, getCampaigns } = useStateContext();
  const [loading, setLoading] = useState(false);
  
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createStartupCampaign(
        data.title,
        data.description,
        data.target,
        data.deadline.getTime(),
        data.image,
        data.video,
        data.equityHolders.map((holder) => ({
          name: holder.name,
          percentage: BigInt(holder.percentage),
        }))
      );

      const campaigns = await getCampaigns();
      const newStartupId = campaigns.length - 1;
      alert("Startup created successfully! You can now upload supporting documents on the startup details page.");
    
      // Redirect to the startup details page
      router.push(`/startups/${newStartupId}`);
    } catch (error) {
      console.error("Failed to create startup campaign", error);
      // Handle error accordingly
    } finally {
      setLoading(false);
    }
  }

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
            Create Your <span className="text-[#00E6E6]">Startup</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Share your vision with potential investors and secure funding for your venture
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white">Startup Details</CardTitle>
              <CardDescription className="text-slate-400">
                Fill in the information below to create your startup campaign
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <motion.div 
                    variants={fadeIn}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center">
                              <FileText size={16} className="mr-2 text-[#00E6E6]" />
                              Startup Title
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your startup name" 
                                {...field} 
                                className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6]"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                              A catchy name that represents your startup
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center">
                              <Target size={16} className="mr-2 text-[#00E6E6]" />
                              Funding Target (AVAX)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. 100" 
                                {...field} 
                                className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6]"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                              The amount of AVAX you aim to raise
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <FileText size={16} className="mr-2 text-[#00E6E6]" />
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your startup, its mission, and how the funds will be used" 
                              {...field} 
                              className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6] min-h-[120px]"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-400">
                            A detailed description of your startup (minimum 50 characters)
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center">
                              <CalendarIconAlt size={16} className="mr-2 text-[#00E6E6]" />
                              Funding Deadline
                            </FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                      "bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700 hover:text-white"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#00E6E6]" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className="bg-slate-800 text-white"
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormDescription className="text-slate-400">
                              The date by which you aim to reach your funding goal
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}                      />                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center">
                              <Upload size={16} className="mr-2 text-[#00E6E6]" />
                              Cover Image URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/your-image.jpg"
                                {...field}
                                className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6]"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                              A high-quality image representing your startup
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="video"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <LinkIcon size={16} className="mr-2 text-[#00E6E6]" />
                            Pitch Video URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/watch?v=your-video-id"
                              {...field}
                              className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6]"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-400">
                            A YouTube link to your pitch video
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div 
                    variants={fadeIn}
                    className="space-y-6"
                  >
                    <div className="border-t border-slate-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white flex items-center">
                          <Users size={18} className="mr-2 text-[#00E6E6]" />
                          Equity Distribution
                        </h3>
                        <Button
                          type="button"
                          onClick={() => append({ name: "", percentage: "" })}
                          className="bg-[#00E6E6]/20 hover:bg-[#00E6E6]/30 text-[#00E6E6] border border-[#00E6E6]/30"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Equity Holder
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="p-4 bg-slate-700/30 rounded-lg relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`equityHolders.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white flex items-center">
                                      <Users size={14} className="mr-2 text-[#00E6E6]" />
                                      Equity Holder Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="e.g. John Doe" 
                                        {...field} 
                                        className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6]"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-400" />
                                    </FormItem>
                                  )}
                                />
  
                                <FormField
                                  control={form.control}
                                  name={`equityHolders.${index}.percentage`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white flex items-center">
                                        <Percent size={14} className="mr-2 text-[#00E6E6]" />
                                        Equity Percentage
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="e.g. 25"
                                          {...field}
                                          className="bg-slate-700/50 border-slate-600 text-white focus:ring-[#00E6E6] focus:border-[#00E6E6]"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-400" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 text-slate-400 hover:text-white hover:bg-slate-700"
                                  onClick={() => remove(index)}
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
  
                    <motion.div 
                      variants={fadeIn}
                      className="pt-4 border-t border-slate-700"
                    >
                      <div className="bg-slate-700/30 p-4 rounded-lg mb-6">
                        <div className="flex items-start">
                          <div className="bg-[#00E6E6]/20 p-2 rounded-full mr-3 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">Important Information</h4>
                            <p className="text-slate-300 text-sm">
                              By creating a startup campaign, you agree to our terms and conditions. All information provided will be stored on the blockchain and will be publicly accessible. Make sure all details are accurate before submitting.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/startups")}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            Cancel
                          </Button>
                          
                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-[#00E6E6] text-slate-900 hover:bg-[#00d1d1] transition-colors"
                          >
                            {loading ? (
                              <>
                                <LoaderIcon className="animate-spin mr-2" size={16} />
                                Creating...
                              </>
                            ) : (
                              "Create Startup"
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Additional Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div variants={fadeIn}>
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <CardTitle className="text-white text-lg">Pitch Video Tips</CardTitle>
                    <CardDescription className="text-slate-400">
                      Create a compelling pitch video to attract investors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Keep it under 3 minutes
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Clearly explain your value proposition
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Demonstrate your product or prototype
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Introduce your team and their expertise
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <CardTitle className="text-white text-lg">Equity Distribution</CardTitle>
                    <CardDescription className="text-slate-400">
                      Best practices for allocating equity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Founders typically retain 60-80% equity
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Reserve 10-20% for future employees
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Allocate based on value contribution
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Consider vesting schedules for team members
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-[#00E6E6]/20 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <CardTitle className="text-white text-lg">Funding Success</CardTitle>
                    <CardDescription className="text-slate-400">
                      Maximize your chances of reaching your goal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Set a realistic funding target
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Create a detailed business plan
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Promote your campaign on social media
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00E6E6] mr-2">•</span>
                        Engage with potential investors promptly
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  };
  
  export default CreateStartup;
  
