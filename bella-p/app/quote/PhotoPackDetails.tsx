"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PhotoPackId } from "../lib/pricing";
import { PHOTO_PACKS } from "../lib/pricing";

export function PhotoPackDetails({ value }: { value: PhotoPackId }) {
  const pack = PHOTO_PACKS[value];
  const show = value !== "none";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {show && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-4 rounded-xl bg-[#20C997]/5 p-4"
        >
          <ul className="space-y-1.5">
            {pack.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-2 text-sm text-[#F8F9FA]/70 leading-snug"
              >
                <span className="text-[#20C997] mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs italic text-[#20C997]/90 leading-snug">
            {pack.marketNote}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
