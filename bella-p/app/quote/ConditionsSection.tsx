import { Reveal } from "./Reveal";

const CONDITIONS = [
  {
    label: "Acompte",
    text: "40 % à la commande, solde à la livraison. (Variante E : 100 % du setup réduit à la commande.)",
  },
  {
    label: "Délais de livraison",
    text: "Option A : 4-6 semaines · Option B : 6-8 semaines · Option C : 2-3 semaines — à compter de la réception des contenus et de l'acompte.",
  },
  {
    label: "Inclus",
    text: "Conception, développement, paramétrage, mise en ligne, formation de prise en main.",
  },
  {
    label: "Exclus",
    text: "Abonnements récurrents (Shopify, apps, domaine), frais de transaction, licences de thème premium, contenu rédactionnel non fourni, campagnes publicitaires payantes.",
  },
  {
    label: "Propriété du site",
    text: "À la livraison et au paiement intégral, le site appartient au client (hors variante E, voir clause de rachat). Le compte Shopify est ouvert au nom du client.",
  },
  {
    label: "Maintenance optionnelle",
    text: "Forfait disponible à partir de 90 € HT/mois (mises à jour, sauvegardes, petites modifications de la carte).",
  },
  {
    label: "Thème premium (optionnel)",
    text: "Licence à vie, généralement entre 200 et 400 € sur le Theme Store officiel selon le thème.",
  },
];

export function ConditionsSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F9FA]">
          Conditions générales
        </h2>
      </Reveal>

      <dl className="mt-6 divide-y divide-white/10">
        {CONDITIONS.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.04}>
            <div className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
              <dt className="font-medium text-[#F8F9FA]">{item.label}</dt>
              <dd className="text-sm text-[#F8F9FA]/65 leading-relaxed">
                {item.text}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
