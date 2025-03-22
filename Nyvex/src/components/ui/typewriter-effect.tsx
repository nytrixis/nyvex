"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffectBackspace = ({
  words,
  className,
  cursorClassName,
  typingSpeed = 150,
  backspaceSpeed = 50,
  delayBetweenWords = 1000,
}: {
  words: string[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  backspaceSpeed?: number;
  delayBetweenWords?: number;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!words.length) return;

    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      // Typing forward
      if (currentText.length < words[currentWordIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(words[currentWordIndex].slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing current word, wait before backspacing
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBetweenWords);
      }
    } else {
      // Backspacing
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, currentText.length - 1));
        }, backspaceSpeed);
      } else {
        // Finished backspacing, move to next word
        const nextIndex = (currentWordIndex + 1) % words.length;
        setCurrentWordIndex(nextIndex);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isTyping, words, typingSpeed, backspaceSpeed, delayBetweenWords]);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <div className="text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center">
        <span>{currentText}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
            cursorClassName
          )}
        ></motion.span>
      </div>
    </div>
  );
};
