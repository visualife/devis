"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "./Reveal";

const CAVEATS = [
  {
    title: "Tarifs Shopify",
    text: "Les prix d'abonnement France relevés en juillet 2026 divergent légèrement selon les sources (Basic à 36 €/mois dans la majorité des grilles, parfois 33 €/mois ; annuel à 25 € ou 27 €/mois). La page officielle shopify.com/fr/tarifs fait foi au moment de la souscription. Les frais Shopify Payments (1,5 % + 0,25 €) et les frais tiers (2 % sur Basic) sont cohérents entre toutes les sources.",
  },
  {
    title: "Applications",
    text: "Les tarifs des apps click & collect sont affichés en dollars US et facturés en USD ; la conversion en euros varie avec le change. Des formules gratuites existent (Bird, Zapiet) mais sont limitées en volume de commandes.",
  },
  {
    title: "Photographie & IA",
    text: "Les fourchettes photo sont des tarifs publics de photographes ; un devis dédié peut varier selon le stylisme et la cession de droits. Les outils IA food peuvent ajouter des éléments non présents dans le plat réel — nous privilégions la retouche fidèle pour éviter tout écart avec le produit servi.",
  },
  {
    title: "Volume de visuels (Pack C)",
    text: "Les 40 visuels (Essentiel) et 100 visuels (Signature) incluent les déclinaisons multi-formats et multi-fonds générées par IA à partir d'un nombre plus restreint de prises de vue sources — il ne s'agit pas de plats distincts photographiés un par un.",
  },
  {
    title: "Email professionnel",
    text: "Le plan gratuit Zoho Mail ne propose pas l'accès IMAP/POP (Outlook, Apple Mail) — uniquement le webmail et l'application Zoho. Sans impact pour un usage simple, mais à garder en tête pour une intégration email plus poussée.",
  },
  {
    title: "Commissions de livraison",
    text: "Les taux Uber Eats/Deliveroo cités sont des ordres de grandeur France 2026 ; Uber Eats a fait évoluer sa grille début mars 2026. Les taux exacts dépendent du contrat signé par le restaurant.",
  },
  {
    title: "Prix Ailive.fr",
    text: "Les montants forfaitaires proposés sont fermes pour le périmètre décrit. Toute évolution du périmètre (pages supplémentaires, intégrations spécifiques, multilingue) fera l'objet d'un avenant.",
  },
];

export function CaveatsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F9FA]">
          Caveats &amp; réserves
        </h2>
      </Reveal>

      <div className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10">
        {CAVEATS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.title}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-[#F8F9FA]">
                  {item.title}
                </span>
                <motion.svg
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-[#20C997]"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-[#F8F9FA]/60 leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
