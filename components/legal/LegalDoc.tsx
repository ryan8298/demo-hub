/**
 * Presentational primitives for the /legal/* documents. Server-safe (no
 * client hooks). Keeps typography consistent across Privacy, Terms,
 * Accessibility, and Cookie pages without a Tailwind typography plugin.
 */

export function DocHeader({
  title,
  updated,
  intro,
}: {
  title: string;
  updated: string;
  intro?: string;
}) {
  return (
    <header className="mb-10 pb-8 border-b hairline">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-3">
        Legal
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-milk leading-tight mb-4">
        {title}
      </h1>
      <p className="text-[11px] uppercase tracking-[0.2em] text-grey-500">
        Last updated · {updated}
      </p>
      {intro && (
        <p className="text-sm md:text-base text-grey-300 leading-relaxed mt-6">
          {intro}
        </p>
      )}
    </header>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl text-milk leading-tight mt-10 mb-4">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-sea-foam mt-6 mb-3">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm md:text-[15px] text-grey-300 leading-relaxed mb-4">
      {children}
    </p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-2 mb-4 ml-1">
      {children}
    </ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm md:text-[15px] text-grey-300 leading-relaxed">
      <span className="w-1.5 h-1.5 rounded-full bg-sea-foam mt-2 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export function MailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="text-sea-foam hover:underline">
      {email}
    </a>
  );
}

export function PageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sea-foam hover:underline">
      {children}
    </a>
  );
}
