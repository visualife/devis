import { Reveal } from "./Reveal";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1A1A1A]">
      <div className="mx-auto max-w-4xl px-6 py-14 text-center">
        <Reveal>
          <p className="font-serif text-xl text-[#F8F9FA]">
            Une pizza qui se commande en trois clics, ça se construit — et ça
            se déguste encore mieux.
          </p>
          <p className="mt-3 text-sm text-[#F8F9FA]/60">
            Bon appétit et à très vite en ligne !
          </p>
          <p className="mt-8 text-xs text-[#F8F9FA]/40">
            Devis établi par Ailive.fr — Emmanuel Mesguich. Pour toute
            question ou ajustement du périmètre, nous restons à votre
            disposition.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
