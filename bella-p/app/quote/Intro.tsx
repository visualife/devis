import { Reveal } from "./Reveal";

export function Intro() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F9FA]">
          Présentation &amp; contexte
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-5 text-[#F8F9FA]/75 leading-relaxed">
          Ailive.fr est une agence parisienne spécialisée dans la création de
          boutiques Shopify et l&apos;automatisation par intelligence
          artificielle. Nous gérons déjà deux boutiques Shopify en production
          et maîtrisons l&apos;ensemble de la chaîne de valeur d&apos;un projet
          restaurant : design graphique, photographie et retouche, 3D,
          post-production vidéo et outils IA de génération d&apos;images
          (Midjourney, Veo 3, etc.).
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <blockquote className="mt-8 rounded-2xl border-l-4 border-[#20C997] bg-[#1A1A1A] px-6 py-5 text-[#F8F9FA]/90 italic leading-relaxed">
          <span className="not-italic font-semibold text-[#20C997]">
            Notre ambition pour Bella Dimo —{" "}
          </span>
          un client qui scrolle Instagram un vendredi soir, tombe sur votre
          margherita encore fumante, craque en trois secondes — et commande
          directement chez vous, sans passer par Uber Eats. Un site qui donne
          faim au premier regard, des visuels qui arrêtent le pouce sur
          l&apos;écran, et une clientèle de quartier fidèle plutôt qu&apos;un
          simple numéro de commande.
        </blockquote>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-8 text-[#F8F9FA]/75 leading-relaxed">
          Ce devis présente plusieurs options tarifaires : un site vitrine, un
          site de commande en ligne avec click &amp; collect, un pack visuel
          photo + IA, une prestation de gestion des réseaux sociaux, ainsi
          qu&apos;une variante à commission permettant de démarrer avec un
          coût initial réduit. Toutes les hypothèses de prix ont été vérifiées
          sur des sources à jour (juillet 2026) et calibrées sur un
          positionnement freelance / petite agence parisienne — pas sur les
          tarifs d&apos;une grande agence.
        </p>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mt-6 rounded-xl bg-[#0D6EFD]/10 px-5 py-4 text-sm text-[#F8F9FA]/70 leading-relaxed">
          <span className="font-semibold text-[#3D8BFD]">
            Note de transparence sur les tarifs Shopify —{" "}
          </span>
          les montants d&apos;abonnement Shopify indiqués ci-dessous sont ceux
          relevés sur les grilles publiques de juillet 2026. Shopify ajuste
          périodiquement ses prix et ses promotions (offre de lancement
          fréquente à 1 €/mois pendant 3 mois) ; le montant exact fait foi sur
          la page officielle{" "}
          <span className="font-medium">shopify.com/fr/tarifs</span> au
          moment de la souscription.
        </p>
      </Reveal>
    </section>
  );
}
