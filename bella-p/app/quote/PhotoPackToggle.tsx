"use client";

import { motion } from "framer-motion";
import type { PhotoPackId } from "../lib/pricing";
import { PHOTO_PACKS, formatEUR } from "../lib/pricing";

const ORDER: PhotoPackId[] = ["none", "essentiel", "signature"];

export function PhotoPackToggle({
  value,
  onChange,
}: {
  value: PhotoPackId;
  onChange: (id: PhotoPackId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ORDER.map((id) => {
        const pack = PHOTO_PACKS[id];
        const selected = value === id;
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={selected}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative rounded-xl border p-4 text-left transition-colors ${
              selected
                ? "border-[#20C997] bg-[#20C997]/[0.06]"
                : "border-white/10 bg-[#1A1A1A] hover:border-white/25"
            }`}
          >
            {selected && (
              <motion.div
                layoutId="photo-pack-dot"
                className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-[#20C997]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <p className="font-medium text-[#F8F9FA] text-sm">{pack.label}</p>
            <p className="mt-1 text-xs text-[#F8F9FA]/55 leading-snug">
              {pack.description}
              {pack.visuals ? ` — ${pack.visuals} visuels` : ""}
            </p>
            <p className="mt-3 font-serif text-xl text-[#20C997]">
              {pack.priceHT === 0 ? "Inclus" : formatEUR(pack.priceHT)}
              {pack.priceHT > 0 && (
                <span className="text-xs text-[#F8F9FA]/45 font-sans"> HT</span>
              )}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
