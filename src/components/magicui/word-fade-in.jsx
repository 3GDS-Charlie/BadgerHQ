import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export default function WordFadeIn({
  words,
  delay = 0.025,

  variants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay }
    })
  },

  className
}) {
  // eslint-disable-next-line no-underscore-dangle
  const _words = words.split("");

  return (
    <motion.h1
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(
        "font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]",
        className
      )}
    >
      {_words.map((word, i) => (
        <motion.span key={i} variants={variants} custom={i}>
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
