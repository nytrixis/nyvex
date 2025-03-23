"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Boxes } from "@/components/ui/background-boxes";
import Footer from "@/components/component/Footer";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const About: React.FC = () => {
  // Animation controls for different sections
  const controlsHero = useAnimation();
  const controlsMission = useAnimation();
  const controlsValues = useAnimation();
  const controlsTeam = useAnimation();

  // Refs to detect when sections are in view
  const [refHero, inViewHero] = useInView({ threshold: 0.3, triggerOnce: true });
  const [refMission, inViewMission] = useInView({ threshold: 0.3, triggerOnce: true });
  const [refValues, inViewValues] = useInView({ threshold: 0.3, triggerOnce: true });
  const [refTeam, inViewTeam] = useInView({ threshold: 0.3, triggerOnce: true });

  // Start animations when sections come into view
  useEffect(() => {
    if (inViewHero) controlsHero.start("visible");
    if (inViewMission) controlsMission.start("visible");
    if (inViewValues) controlsValues.start("visible");
    if (inViewTeam) controlsTeam.start("visible");
  }, [inViewHero, inViewMission, inViewValues, inViewTeam, controlsHero, controlsMission, controlsValues, controlsTeam]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
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

  const cardVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative">
      {/* Hero Section with Background Boxes */}
      <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
        {/* Background mask for better text visibility */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none opacity-60" />
        
        {/* Background boxes */}
        <Boxes />
        
        {/* Hero content */}
        <div className="container mx-auto px-4 flex flex-col justify-center items-center relative z-30" ref={refHero}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={controlsHero}
            className="text-center max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              About <span className="text-[#00E6E6]">NyveX</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Revolutionizing cross-chain investments on AVAX with security and transparency
            </p>
            <div className="flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-[#00E6E6] to-blue-500 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gradient-to-b from-slate-900 to-[#1a2942]">
        <div className="container mx-auto px-4" ref={refMission}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={controlsMission}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Our <span className="text-[#00E6E6]">Mission</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              NyveX is building a future where investment opportunities are accessible, secure, and transparent for everyone.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={controlsMission}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={cardVariant} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-[#00E6E6] transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00E6E6] to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Empowering Startups</h3>
              <p className="text-slate-300">
                Nyvex provides the tools needed for growth and innovation, reducing barriers to funding and enabling startups to focus on what they do best.
              </p>
            </motion.div>

            <motion.div variants={cardVariant} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-[#00E6E6] transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00E6E6] to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Building Trust</h3>
              <p className="text-slate-300">
                Through blockchain technology, we ensure all transactions are transparent and secure, building trust between startups and investors.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-20 bg-[#1a2942]" ref={refValues}>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={controlsValues}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Core <span className="text-[#00E6E6]">Values</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              The principles that guide everything we do at NyveX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency",
                description: "We believe in complete transparency in all our operations and transactions.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )
              },
              {
                title: "Innovation",
                description: "We constantly push the boundaries of what's possible in the investment space.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Security",
                description: "We prioritize the security of our platform and our users' data above all else.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                variants={cardVariant}
                className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-[#00E6E6] transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#00E6E6] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{value.title}</h3>
                <p className="text-slate-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      {/* <div className="py-20 bg-gradient-to-b from-[#1a2942] to-slate-900" ref={refTeam}>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={controlsTeam}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Our <span className="text-[#00E6E6]">Team</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Meet the passionate individuals behind NyveX
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[1, 2, 3, 4].map((member, index) => (
              <motion.div 
                key={index}
                variants={cardVariant}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-[#00E6E6] transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-64 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">Team Member {member}</h3>
                  <p className="text-[#00E6E6] mb-4">Position Title</p>
                  <p className="text-slate-300 text-sm">
                    Passionate about blockchain technology and creating innovative solutions for the investment space.
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div> */}

      {/* Impact Section */}
      <div className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              NyveX <span className="text-[#00E6E6]">Impact</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              How we are making a difference in the startup ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">For Startups</h3>
              <ul className="space-y-4">
                {[
                  "Empowering startups by providing the tools needed for growth and innovation",
                  "Reducing barriers to funding through a streamlined process",
                  "Offering a platform for showcasing innovative ideas to a global audience",
                  "Providing transparent and secure funding mechanisms",
                  "Creating opportunities for mentorship and guidance"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#00E6E6] rounded-full flex items-center justify-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">For Investors</h3>
              <ul className="space-y-4">
                {[
                  "Building trust through transparency in all transactions",
                  "Offering deeper engagement with startups via video pitches",
                  "Providing opportunities to diversify investment portfolios",
                  "Ensuring security through blockchain technology",
                  "Creating a community of like-minded investors"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#00E6E6] rounded-full flex items-center justify-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-b from-slate-900 to-[#1a2942]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-slate-800 to-slate-900 p-12 rounded-2xl border border-slate-700 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Join the <span className="text-[#00E6E6]">NyveX</span> Revolution?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Whether you are a startup looking for funding or an investor seeking opportunities, NyveX provides the platform you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#00E6E6] text-slate-900 font-medium rounded-lg hover:bg-[#00d1d1] transition-colors">
                Get Started
              </button>
              <button className="px-8 py-3 bg-transparent text-[#00E6E6] font-medium rounded-lg border border-[#00E6E6] hover:bg-[#00E6E6]/10 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default About;
