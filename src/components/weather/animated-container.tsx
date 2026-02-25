"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimatedContainerProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export const AnimatedContainer = ({
  children,
  delay = 0,
  className,
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn = ({
  children,
  delay = 0,
  className,
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({
  children,
  delay = 0,
  className,
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
