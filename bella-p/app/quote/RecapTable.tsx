"use client";

import type { PhotoPackId, PrimaryOptionId } from "../lib/pricing";
import { Reveal } from "./Reveal";

type Row = {
  match: (primary: PrimaryOptionId, pack: PhotoPackId) => boolean;
  option: string;
  descriptif: string;
  ht: string;
  ttc: string;
};

const ROWS: Row[] = [
  {
    match: (p) => p === "A",
    option: "A",
    descriptif: "Site vitrine Shopify",
    ht: "1 900 €",
    ttc: "2 280 €",
  },
  {
    match: (p) => p === "B",
    option: "B",
    descriptif: "Site + commande en ligne & click & collect",
    ht: "3 200 €",
    ttc: "3 840 €",
  },
  {
    match: (_p, pack) => pack === "essentiel",
    option: "C — Essentiel",
    descriptif: "Retouche & déclinaisons IA (40 visuels)",
    ht: "690 €",
    ttc: "828 €",
  },
  {
    match: (_p, pack) => pack === "signature",
    option: "C — Signature",
    descriptif: "Shooting + retouche IA (100 visuels)",
    ht: "1 350 €",
    ttc: "1 620 €",
  },
  {
    match: () => false,
    option: "D",
    descriptif: "Gestion réseaux sociaux (mensuel)",
    ht: "390 €/mois",
    ttc: "468 €/mois",
  },
  {
    match: (p) => p === "E",
    option: "E",
    descriptif: "Site commande à commission (setup réduit)",
    ht: "900 € + 10 %",
    ttc: "1 080 € + 10 %",
  },
];

export function RecapTable({
  primary,
  photoPack,
  social,
}: {
  primary: PrimaryOptionId;
  photoPack: PhotoPackId;
  social: boolean;
}) {
  return (
    <Reveal className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F9FA]">
        Tableau récapitulatif des options
      </h2>
      <p className="mt-2 text-sm text-[#F8F9FA]/55">
        Les lignes correspondant à votre sélection actuelle sont mises en
        évidence.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-[#F8F9FA]/60">
              <th className="px-4 py-3 font-medium">Option</th>
              <th className="px-4 py-3 font-medium">Descriptif</th>
              <th className="px-4 py-3 font-medium">Prix HT</th>
              <th className="px-4 py-3 font-medium">Prix TTC (TVA 20 %)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const isMatch =
                row.match(primary, photoPack) ||
                (row.option === "D" && social);
              return (
                <tr
                  key={row.option}
                  className={`border-t border-white/10 transition-colors ${
                    isMatch ? "bg-[#20C997]/[0.08]" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-[#F8F9FA]">
                    {row.option}
                  </td>
                  <td className="px-4 py-3 text-[#F8F9FA]/70">
                    {row.descriptif}
                  </td>
                  <td className="px-4 py-3 text-[#F8F9FA]/70">{row.ht}</td>
                  <td className="px-4 py-3 text-[#F8F9FA]/70">{row.ttc}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[#F8F9FA]/40">
        Prix indiqués hors taxes. TVA à 20 % applicable en sus. Devis établi
        en euros.
      </p>
    </Reveal>
  );
}
