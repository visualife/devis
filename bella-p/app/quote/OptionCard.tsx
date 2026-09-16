"use client";

import { motion } from "framer-motion";
import type { PrimaryOptionId } from "../lib/pricing";
import { PRIMARY_OPTIONS, formatEUR } from "../lib/pricing";

const MARKET_NOTE: Record<PrimaryOptionId, string> = {
  A: "Fourchette de marché vérifiée (Sleekly, 2026) : 1 500 à 4 000 € pour un freelance / petite agence.",
  B: "Fourchette de marché vérifiée : 4 000 à 10 000 € (MonDevisWeb.fr) ou 2 500 à 5 000 € en clé en main freelance (X. Jaleran).",
  E: "10 % de commission, contre 25-35 % prélevés en moyenne par Uber Eats / Deliveroo.",
};

export function OptionCard({
  id,
  selected,
  onSelect,
}: {
  id: PrimaryOptionId;
  selected: boolean;
  onSelect: (id: PrimaryOptionId) => void;
}) {
  const option = PRIMARY_OPTIONS[id];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative w-full text-left rounded-2xl border p-6 transition-colors ${
        selected
          ? "border-[#20C997] bg-[#20C997]/[0.06]"
          : "border-white/10 bg-[#1A1A1A] hover:border-white/25"
      }`}
    >
      {selected && (
        <motion.div
          layoutId="option-selected-badge"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-[#20C997] to-[#0D6EFD] px-3 py-1 text-xs font-semibold text-white shadow-sm"
        >
          Sélectionné
        </motion.div>
      )}

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-serif text-lg text-[#F8F9FA]">
          Option {option.letter} — {option.label}
        </span>
      </div>
      <p className="mt-1 text-sm text-[#F8F9FA]/55">{option.tagline}</p>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-serif text-3xl bg-gradient-to-r from-[#20C997] to-[#3D8BFD] bg-clip-text text-transparent">
          {formatEUR(option.priceHT)}
        </span>
        <span className="text-sm text-[#F8F9FA]/45 pb-1">HT</span>
        {option.commissionRate && (
          <span className="text-sm text-[#F8F9FA]/45 pb-1">
            + {option.commissionRate * 100} % sur les commandes
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-1.5">
        {option.bullets.map((bullet) => (
          <li
            key={bullet}
            className="text-sm text-[#F8F9FA]/65 flex gap-2 leading-snug"
          >
            <span className="text-[#20C997] mt-0.5">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-[#F8F9FA]/40">
        Délai estimé : {option.delay}
      </p>
      <p className="mt-2 text-xs text-[#3D8BFD]/90 italic leading-snug">
        {MARKET_NOTE[id]}
      </p>
    </motion.button>
  );
}
