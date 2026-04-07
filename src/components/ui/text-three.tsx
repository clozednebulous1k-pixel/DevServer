"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TextThree() {
  const text = "Namaste World!";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="flex h-64 items-center justify-center p-4">
      <motion.div
        className="text-4xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayText}
      </motion.div>
    </div>
  );
}
