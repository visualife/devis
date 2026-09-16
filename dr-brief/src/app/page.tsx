import { BriefForm } from '@/components/BriefForm';

/* BriefForm is a client component, but it still renders on the server, so the
   full brief — every question, hint and "ce que je sais déjà" box — is present
   in the HTML and readable with JavaScript off. Only sending needs JS. */
export default function Page() {
  return <BriefForm />;
}
