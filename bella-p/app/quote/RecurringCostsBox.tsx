"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PrimaryOptionId } from "../lib/pricing";

const ROWS = [
  {
    label: "Abonnement Shopify (plan Basic)",
    value: "36 €/mois, ou 25 €/mois en engagement annuel",
  },
  {
    label: "Application click & collect / commande",
    value: "≈ 20 à 30 €/mois (formule gratuite possible à faible volume)",
  },
  {
    label: "Frais de transaction Shopify Payments",
    value: "1,5 % + 0,25 € par commande en ligne",
  },
  { label: "Nom de domaine .fr", value: "≈ 15 €/an" },
  { label: "Email professionnel", value: "0 € — Zoho Mail, plan gratuit" },
];

export function RecurringCostsBox({
  primary,
}: {
  primary: PrimaryOptionId;
}) {
  const show = primary === "B" || primary === "E";

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="recurring"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-5">
            <p className="text-xs uppercase tracking-wide text-[#F8F9FA]/50 font-medium">
              Coûts mensuels récurrents — facturés par Shopify / éditeurs tiers,
              pas par Ailive.fr
            </p>
            <dl className="mt-3 divide-y divide-white/10">
              {ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 py-2"
                >
                  <dt className="text-sm text-[#F8F9FA]/70">{row.label}</dt>
                  <dd className="text-sm font-medium text-[#F8F9FA] sm:text-right">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            {primary === "E" && (
              <p className="mt-3 text-xs text-[#F8F9FA]/55 leading-relaxed">
                Variante E : engagement minimal 12 mois, commission facturée
                mensuellement sur les commandes en ligne. Rachat possible du
                site au-delà de 12 mois pour basculer sans commission (2 300 €
                HT la 1ʳᵉ année, dégressif ensuite).
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
