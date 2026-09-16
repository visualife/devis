export const TVA_RATE = 0.2;

export type PrimaryOptionId = "A" | "B" | "E";
export type PhotoPackId = "none" | "essentiel" | "signature";

export const PRIMARY_OPTIONS: Record<
  PrimaryOptionId,
  {
    id: PrimaryOptionId;
    letter: string;
    label: string;
    tagline: string;
    priceHT: number;
    delay: string;
    commissionRate?: number;
    bullets: string[];
  }
> = {
  A: {
    id: "A",
    letter: "A",
    label: "Site vitrine Shopify",
    tagline: "Être trouvable, donner faim, rassurer en un coup d'œil",
    priceHT: 1900,
    delay: "4 à 6 semaines",
    bullets: [
      "Design personnalisé sur thème Shopify de qualité",
      "Page menu / carte avec photos, descriptions, prix",
      "Horaires, plan d'accès, contact",
      "Fiche Google Business Profile",
      "SEO local de base",
      "100 % responsive + RGPD",
      "Formation 1h + mise en ligne",
    ],
  },
  B: {
    id: "B",
    letter: "B",
    label: "Site + commande en ligne & click & collect",
    tagline: "Transformer chaque visite en commande, sans reverser 20-30 % à un tiers",
    priceHT: 3200,
    delay: "6 à 8 semaines",
    bullets: [
      "Tout l'Option A, plus :",
      "Commande en ligne (catalogue produits / menu)",
      "Click & collect avec créneaux de retrait",
      "Paiement en ligne sécurisé (Shopify Payments)",
      "Tableau de bord de gestion des commandes",
      "Emails de confirmation automatisés",
      "Formation étendue (2h)",
    ],
  },
  E: {
    id: "E",
    letter: "E",
    label: "Variante — Commande à commission",
    tagline: "Démarrer avec un coût initial très réduit",
    priceHT: 900,
    delay: "6 à 8 semaines",
    commissionRate: 0.1,
    bullets: [
      "Périmètre identique à l'Option B",
      "Coût initial réduit : 900 € HT (au lieu de 3 200 €)",
      "Commission de 10 % HT sur les commandes en ligne",
      "Engagement minimal : 12 mois",
      "Rachat possible dès 2 300 € HT (1ʳᵉ année, dégressif)",
    ],
  },
};

export const PHOTO_PACKS: Record<
  PhotoPackId,
  {
    id: PhotoPackId;
    label: string;
    description: string;
    priceHT: number;
    visuals: number | null;
    bullets: string[];
    marketNote: string;
  }
> = {
  none: {
    id: "none",
    label: "Aucun pack visuel",
    description: "Vous fournissez vos propres photos",
    priceHT: 0,
    visuals: null,
    bullets: [],
    marketNote: "",
  },
  essentiel: {
    id: "essentiel",
    label: "Pack Essentiel",
    description: "Retouche IA & déclinaisons multi-formats",
    priceHT: 690,
    visuals: 40,
    bullets: [
      "À partir de vos photos (ou smartphone de bonne qualité)",
      "Retouche IA professionnelle pour 40 visuels",
      "Remplacement d'arrière-plans (fond neutre, ambiance table, comptoir)",
      "Déclinaisons multi-formats : Instagram, TikTok, Facebook",
      "Livraison en HD, prêts à l'emploi",
    ],
    marketNote:
      "Une prestation photographe classique à 250-500 € ne produit généralement que 10 à 15 clichés retouchés : 40 visuels démultiplient le contenu pour un budget équivalent.",
  },
  signature: {
    id: "signature",
    label: "Pack Signature",
    description: "Shooting sur place + retouche & déclinaisons IA",
    priceHT: 1350,
    visuals: 100,
    bullets: [
      "Shooting photo sur une demi-journée, sur place",
      "100 visuels finaux, déclinés en dizaines de versions",
      "Remplacement d'arrière-plans + déclinaisons multi-formats",
      "Direction artistique et stylisme léger inclus",
    ],
    marketNote:
      "Repères vérifiés : une demi-journée de photographe culinaire freelance à Paris coûte 250 à 1 500 €+ pour 10-50 photos. Le pack Signature dépasse ce volume (100 visuels) pour un tarif inférieur, grâce à la déclinaison IA.",
  },
};

export const SOCIAL_MONTHLY_HT = 390;
export const MAINTENANCE_MONTHLY_HT_FROM = 90;

export const THIRD_PARTY_MONTHLY_LOW = 46; // 25 (Shopify annuel) + 20 (app) + ~1.25 (domaine)
export const THIRD_PARTY_MONTHLY_HIGH = 67; // 36 (Shopify mensuel) + 30 (app) + ~1.25 (domaine)

export function toTTC(ht: number) {
  return ht * (1 + TVA_RATE);
}

export function formatEUR(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
