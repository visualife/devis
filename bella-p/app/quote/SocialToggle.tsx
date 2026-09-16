"use client";

import { motion } from "framer-motion";
import { SOCIAL_MONTHLY_HT, formatEUR } from "../lib/pricing";

export function SocialToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
        checked
          ? "border-[#3D8BFD] bg-[#0D6EFD]/[0.08]"
          : "border-white/10 bg-[#1A1A1A]"
      }`}
    >
      <div>
        <p className="font-medium text-[#F8F9FA] text-sm">
          Option D — Gestion des réseaux sociaux
        </p>
        <p className="mt-1 text-xs text-[#F8F9FA]/55 leading-snug max-w-md">
          3 publications/semaine, stories, modération, reporting mensuel.
          Sans engagement de durée (préavis 1 mois).
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 pl-4">
        <span className="font-serif text-lg text-[#3D8BFD] whitespace-nowrap">
          {formatEUR(SOCIAL_MONTHLY_HT)}
          <span className="text-xs text-[#F8F9FA]/45 font-sans">
            {" "}
            HT/mois
          </span>
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            checked ? "bg-[#0D6EFD]" : "bg-white/15"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow"
            style={{ left: checked ? "calc(100% - 26px)" : "2px" }}
          />
        </button>
      </div>
    </div>
  );
}
