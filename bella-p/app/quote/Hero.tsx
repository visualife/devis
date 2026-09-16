"use client";

import { motion } from "framer-motion";

const metaItems = [
  { label: "Client", value: "Pizzeria Bella Dimo — Paris" },
  { label: "Date d'émission", value: "20 juillet 2026" },
  { label: "Numéro de devis", value: "AIL-2026-0720-BDIMO" },
  { label: "Validité", value: "30 jours (jusqu'au 19 août 2026)" },
];

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-[#121212] text-[#F8F9FA]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(600px circle at 15% 20%, rgba(32,201,151,0.25), transparent 60%), radial-gradient(500px circle at 85% 0%, rgba(13,110,253,0.25), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-14 sm:pt-28 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm tracking-[0.2em] uppercase text-[#20C997] font-medium"
        >
          Ailive.fr — Devis
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight text-balance bg-gradient-to-br from-[#20C997] to-[#0D6EFD] bg-clip-text text-transparent"
        >
          Création de site Shopify &amp; prestations visuelles
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-xl text-lg text-[#F8F9FA]/80"
        >
          Agence spécialisée Shopify, design graphique, 3D, post-production
          vidéo &amp; outils IA — Paris. Émis par Emmanuel Mesguich, fondateur.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 border-t border-[#F8F9FA]/15 pt-6"
        >
          {metaItems.map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-wide text-[#F8F9FA]/50">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#F8F9FA]">
                {item.value}
              </dd>
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
