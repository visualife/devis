"use client";

import { useState } from "react";
import type { PhotoPackId, PrimaryOptionId } from "../lib/pricing";
import { CaveatsSection } from "./CaveatsSection";
import { ConditionsSection } from "./ConditionsSection";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { OptionCard } from "./OptionCard";
import { PhotoPackDetails } from "./PhotoPackDetails";
import { PhotoPackToggle } from "./PhotoPackToggle";
import { ProgressBar } from "./ProgressBar";
import { RecapTable } from "./RecapTable";
import { RecommendationsSection } from "./RecommendationsSection";
import { RecurringCostsBox } from "./RecurringCostsBox";
import { Reveal } from "./Reveal";
import { SiteFooter } from "./SiteFooter";
import { SocialToggle } from "./SocialToggle";
import { SummaryBar } from "./SummaryBar";

const PRIMARY_ORDER: PrimaryOptionId[] = ["A", "B", "E"];

export function QuotePage() {
  const [primary, setPrimary] = useState<PrimaryOptionId>("B");
  const [photoPack, setPhotoPack] = useState<PhotoPackId>("essentiel");
  const [social, setSocial] = useState(false);

  return (
    <div className="bg-[#121212]">
      <ProgressBar />
      <Hero />
      <Intro />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F9FA]">
            Composez votre devis
          </h2>
          <p className="mt-2 text-sm text-[#F8F9FA]/55 max-w-xl">
            Choisissez une formule principale, ajoutez un pack visuel et la
            gestion des réseaux sociaux si besoin — le total se met à jour en
            temps réel.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#F8F9FA]/50">
            1 — Formule principale
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {PRIMARY_ORDER.map((id) => (
              <OptionCard
                key={id}
                id={id}
                selected={primary === id}
                onSelect={setPrimary}
              />
            ))}
          </div>
          <RecurringCostsBox primary={primary} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#F8F9FA]/50">
            2 — Pack visuel photo + IA (Option C)
          </h3>
          <div className="mt-4">
            <PhotoPackToggle value={photoPack} onChange={setPhotoPack} />
            <PhotoPackDetails value={photoPack} />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#F8F9FA]/50">
            3 — Récurrent (optionnel)
          </h3>
          <div className="mt-4">
            <SocialToggle checked={social} onChange={setSocial} />
          </div>
        </Reveal>
      </section>

      <RecapTable primary={primary} photoPack={photoPack} social={social} />
      <RecommendationsSection />
      <ConditionsSection />
      <CaveatsSection />
      <SiteFooter />

      <SummaryBar primary={primary} photoPack={photoPack} social={social} />
    </div>
  );
}
