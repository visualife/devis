"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { PhotoPackId, PrimaryOptionId } from "../lib/pricing";
import {
  PHOTO_PACKS,
  PRIMARY_OPTIONS,
  SOCIAL_MONTHLY_HT,
  formatEUR,
  toTTC,
} from "../lib/pricing";
import { AnimatedNumber } from "./AnimatedNumber";

export function SummaryBar({
  primary,
  photoPack,
  social,
}: {
  primary: PrimaryOptionId;
  photoPack: PhotoPackId;
  social: boolean;
}) {
  const [open, setOpen] = useState(false);

  const option = PRIMARY_OPTIONS[primary];
  const pack = PHOTO_PACKS[photoPack];
  const setupHT = option.priceHT + pack.priceHT;
  const setupTTC = toTTC(setupHT);
  const monthlyHT = social ? SOCIAL_MONTHLY_HT : 0;

  return (
    <motion.div
      layout
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="rounded-2xl border border-white/10 bg-[#1A1A1A]/95 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 px-5 py-3.5"
        >
          <span className="text-xs uppercase tracking-wide text-[#F8F9FA]/50">
            Total estimé
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-serif text-xl bg-gradient-to-r from-[#20C997] to-[#3D8BFD] bg-clip-text text-transparent">
              <AnimatedNumber value={setupHT} format={formatEUR} />
            </span>
            <span className="text-xs text-[#F8F9FA]/45">HT</span>
            {option.commissionRate && (
              <span className="text-xs text-[#F8F9FA]/45">
                + {option.commissionRate * 100}%
              </span>
            )}
            <motion.svg
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="ml-1 text-[#F8F9FA]/40"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-white/10 px-5"
            >
              <div className="py-4 space-y-2 text-sm">
                <Row
                  label={`Option ${option.letter} — ${option.label}`}
                  value={formatEUR(option.priceHT)}
                />
                {pack.priceHT > 0 && (
                  <Row label={pack.label} value={formatEUR(pack.priceHT)} />
                )}
                <div className="flex items-center justify-between border-t border-white/10 pt-2 font-medium text-[#F8F9FA]">
                  <span>Coût initial (setup) HT</span>
                  <span>
                    <AnimatedNumber value={setupHT} format={formatEUR} />
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#F8F9FA]/60">
                  <span>Soit TTC (TVA 20 %)</span>
                  <span>
                    <AnimatedNumber value={setupTTC} format={formatEUR} />
                  </span>
                </div>
                {monthlyHT > 0 && (
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[#3D8BFD]">
                    <span>Réseaux sociaux (récurrent)</span>
                    <span>{formatEUR(monthlyHT)} HT/mois</span>
                  </div>
                )}
                {option.commissionRate && (
                  <p className="pt-1 text-xs text-[#F8F9FA]/45 leading-snug">
                    + {option.commissionRate * 100} % sur les commandes en
                    ligne (variable, non inclus ci-dessus)
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[#F8F9FA]/65">
      <span className="pr-4">{label}</span>
      <span className="whitespace-nowrap">{value}</span>
    </div>
  );
}
