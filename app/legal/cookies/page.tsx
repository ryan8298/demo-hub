import type { Metadata } from 'next';
import { DocHeader, H2, P, UL, LI, MailLink, PageLink } from '@/components/legal/LegalDoc';
import { COMPANY, LEGAL_EFFECTIVE_DATE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie Notice',
  description: `How the Echelix Demo Hub uses cookies and similar technologies.`,
};

export default function CookiesPage() {
  return (
    <>
      <DocHeader
        title="Cookie Notice"
        updated={LEGAL_EFFECTIVE_DATE}
        intro={`This Cookie Notice explains how ${COMPANY.legalName} uses cookies and similar technologies on ${COMPANY.domain}. We keep our use of cookies deliberately minimal.`}
      />

      <H2>What are cookies?</H2>
      <P>
        Cookies are small text files placed on your device when you visit a
        website. They are widely used to make websites work, or work more
        efficiently, and to provide information to site operators.
      </P>

      <H2>The cookies we use</H2>
      <UL>
        <LI>
          <strong>Strictly-necessary session cookie</strong> — when you sign in,
          we set a single signed (HMAC) cookie that keeps you authenticated as
          you move between pages. Without it, the Demo Hub cannot keep you
          logged in. This cookie is essential and is not used for advertising or
          cross-site tracking. Visitor sessions last up to 30 days; admin
          sessions are short-lived.
        </LI>
        <LI>
          <strong>No advertising or third-party tracking cookies</strong> — we
          do not use cookies to build advertising profiles or track you across
          other websites.
        </LI>
      </UL>

      <H2>Analytics (cookieless)</H2>
      <P>
        We use Vercel Analytics and Speed Insights to understand aggregate
        traffic and performance. These tools are designed to be privacy-friendly
        and operate without using cookies or persistently identifying individual
        visitors.
      </P>

      <H2>Local storage</H2>
      <P>
        We use your browser&apos;s local storage for small conveniences — for
        example, remembering that you dismissed our cookie banner and your
        recently viewed demos. This information stays on your device and is not
        a cookie.
      </P>

      <H2>Managing cookies</H2>
      <P>
        Because our only cookie is strictly necessary for the Service to
        function, there is nothing to opt into for advertising. You can still
        clear or block cookies through your browser settings, but doing so will
        prevent you from staying signed in to the Demo Hub.
      </P>

      <H2>More information</H2>
      <P>
        For how we handle personal information generally, see our{' '}
        <PageLink href="/legal/privacy">Privacy Policy</PageLink>. Questions
        about this notice? Email <MailLink email={COMPANY.email.privacy} />.
      </P>
    </>
  );
}
