import { Reveal } from "./Reveal";

const STEPS = [
  {
    title: "Démarrer par l'Option B + Pack C Essentiel",
    text: "Le vrai levier de rentabilité n'est pas la vitrine seule mais la commande en direct, qui vous affranchit des 25-35 % prélevés par les plateformes. Budget de lancement : 3 890 € HT + coûts récurrents modestes (~60-70 €/mois tout compris).",
  },
  {
    title: "Trésorerie serrée ? Choisir la Variante E",
    text: "900 € HT + 10 %. Vous ne payez la prestation qu'au rythme de vos ventes en ligne, et restez 2,5 à 3,5 fois moins cher qu'Uber Eats/Deliveroo. Seuil de bascule : au-delà de ~3 000 €/mois de commandes en ligne stables, racheter le site devient plus avantageux.",
  },
  {
    title: "Ajouter l'Option D une fois le site en ligne",
    text: "Pas avant — pour que le trafic généré atterrisse sur un canal de commande qui vous appartient.",
  },
  {
    title: "Rester sur le plan Shopify Basic",
    text: "Tant que le chiffre d'affaires en ligne reste inférieur à ~20 000 €/mois : au-delà seulement, l'analyse des frais justifie d'étudier le plan supérieur (Grow).",
  },
];

export function RecommendationsSection() {
  return (
    <section className="bg-[#1A1A1A] text-[#F8F9FA]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <h2 className="font-serif text-2xl sm:text-3xl">
            Recommandations d&apos;Ailive.fr
          </h2>
          <p className="mt-2 text-sm text-[#F8F9FA]/60 max-w-xl">
            Pour un restaurant de quartier comme Bella Dimo, notre conseil,
            par étapes :
          </p>
        </Reveal>

        <ol className="mt-8 space-y-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#20C997] to-[#0D6EFD] font-serif text-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-[#F8F9FA]/70 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
