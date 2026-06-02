import type { Metadata } from 'next';
import { DocHeader, H2, P, UL, LI, MailLink, PageLink } from '@/components/legal/LegalDoc';
import { COMPANY, LEGAL_EFFECTIVE_DATE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${COMPANY.legalName} uses cookies and similar technologies on our sites.`,
};

export default function CookiesPage() {
  return (
    <>
      <DocHeader
        title="Cookie Policy"
        updated={LEGAL_EFFECTIVE_DATE}
        dateLabel="Effective date"
        intro={`This Cookie Policy explains how ${COMPANY.legalName} ("Echelix," "we," or "us") uses cookies and similar technologies on our websites and mobile sites that link to this policy (our "sites"). It should be read together with our Privacy Policy.`}
      />

      <H2>What are cookies?</H2>
      <P>
        Cookies are small text files placed on your device when you visit a
        website. They are widely used to make sites work, or work more
        efficiently, and to provide information to site operators. We also use
        similar technologies such as pixels, tags, and local storage, which we
        refer to together with cookies as &ldquo;cookies&rdquo; in this policy.
      </P>

      <H2>Why we use cookies</H2>
      <P>
        Our sites may use cookies and similar technologies to tell us that your
        browser has visited our sites and to help us:
      </P>
      <UL>
        <LI>understand how our sites are used</LI>
        <LI>remember your choices</LI>
        <LI>improve performance</LI>
        <LI>provide more relevant content and ads</LI>
      </UL>

      <H2>Types of cookies we use</H2>
      <UL>
        <LI>
          <strong>Essential cookies</strong> — required for the sites to
          function, including keeping you signed in to secure areas such as the
          demo hub.
        </LI>
        <LI>
          <strong>Performance and analytics cookies</strong> — help us
          understand how visitors use our sites so we can measure and improve
          performance.
        </LI>
        <LI>
          <strong>Functionality cookies</strong> — remember your choices and
          preferences.
        </LI>
        <LI>
          <strong>Advertising and targeting cookies</strong> — help us and our
          partners measure the effectiveness of marketing and deliver content
          and ads that may be more relevant to your interests.
        </LI>
      </UL>

      <H2>Third parties</H2>
      <P>
        Some cookies may be set by the service providers and partners described
        in our Privacy Policy — including cloud hosting, analytics, and
        marketing or advertising partners. Their use of information is governed
        by their own policies.
      </P>

      <H2>&ldquo;Do Not Track&rdquo;</H2>
      <P>
        Some web browsers offer a &ldquo;Do Not Track&rdquo; setting. There is
        no common standard for how to respond to these signals. At this time,
        our sites may not respond to these signals.
      </P>

      <H2>Managing cookies</H2>
      <P>
        You can manage some cookie choices in your browser and, where offered,
        in our cookie or privacy preference tools. Most browsers let you refuse
        or delete cookies; if you do, some parts of our sites — including signed-in
        areas — may not work properly.
      </P>

      <H2>More information</H2>
      <P>
        For how we handle personal information generally, see our{' '}
        <PageLink href="/legal/privacy">Privacy Policy</PageLink>. Questions
        about this policy? Email <MailLink email={COMPANY.email.privacy} />.
      </P>
    </>
  );
}
