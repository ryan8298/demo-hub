import type { Metadata } from 'next';
import { DocHeader, H2, H3, P, UL, LI, MailLink, PageLink } from '@/components/legal/LegalDoc';
import { COMPANY, LEGAL_EFFECTIVE_DATE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${COMPANY.legalName} collects, uses, and protects personal information on the Echelix Demo Hub.`,
};

export default function PrivacyPage() {
  return (
    <>
      <DocHeader
        title="Privacy Policy"
        updated={LEGAL_EFFECTIVE_DATE}
        intro={`This Privacy Policy explains how ${COMPANY.legalName} ("Echelix," "we," "us," or "our") collects, uses, discloses, and safeguards personal information when you visit ${COMPANY.domain} (the "Site") and the Echelix Demo Hub. By using the Site, you agree to the practices described here.`}
      />

      <H2>1. Who we are</H2>
      <P>
        {COMPANY.legalName} is a limited liability company organized under the
        laws of the {COMPANY.jurisdiction}, located in {COMPANY.location}. For
        the purposes of applicable data-protection law, Echelix is the
        controller of personal information processed through the Site. You can
        reach our privacy team at <MailLink email={COMPANY.email.privacy} />.
      </P>

      <H2>2. Information we collect</H2>
      <H3>Information you provide</H3>
      <UL>
        <LI>
          <strong>Account / access details</strong> — when you request access
          to the Demo Hub, we collect your name, work email address, and company
          name, and we send a one-time passcode to verify your email.
        </LI>
        <LI>
          <strong>Use-case submissions</strong> — if you submit an idea through
          our pilot form, we collect your name, email, company, industry, and
          the use-case details you choose to share.
        </LI>
        <LI>
          <strong>Communications</strong> — if you email us or book a call, we
          retain the content of those communications and your scheduling
          details.
        </LI>
      </UL>
      <H3>Information collected automatically</H3>
      <UL>
        <LI>
          <strong>Session cookie</strong> — a single, strictly-necessary,
          signed cookie that keeps you authenticated. See our{' '}
          <PageLink href="/legal/cookies">Cookie Notice</PageLink>.
        </LI>
        <LI>
          <strong>Usage analytics</strong> — we use privacy-friendly,
          cookieless analytics (Vercel Analytics and Speed Insights) that
          measure aggregate page performance and traffic without profiling
          individual visitors.
        </LI>
        <LI>
          <strong>Limited technical data</strong> — server logs may record IP
          address and browser/user-agent for security, rate-limiting, and abuse
          prevention.
        </LI>
      </UL>

      <H2>3. How we use information</H2>
      <UL>
        <LI>To authenticate you and provide access to the Demo Hub.</LI>
        <LI>To respond to inquiries, schedule discovery calls, and evaluate use-case submissions for our Embedded Agent Pilot program.</LI>
        <LI>To operate, secure, maintain, and improve the Site, including rate-limiting and fraud/abuse prevention.</LI>
        <LI>To send transactional messages (such as verification codes) and, where permitted, relevant follow-up about your request.</LI>
        <LI>To comply with legal obligations and enforce our <PageLink href="/legal/terms">Terms of Service</PageLink>.</LI>
      </UL>

      <H2>4. Legal bases for processing</H2>
      <P>
        Where the EU/UK GDPR applies, we rely on the following legal bases:
        performance of a contract (providing access you request); our legitimate
        interests (securing the Site, evaluating submissions, improving our
        services); consent (where required, e.g., optional marketing); and
        compliance with legal obligations.
      </P>

      <H2>5. How we share information</H2>
      <P>
        We do not sell your personal information. We share it only with:
      </P>
      <UL>
        <LI>
          <strong>Service providers</strong> that process data on our behalf
          under contract — including Supabase (database and authentication),
          Vercel (hosting and analytics), and Microsoft (Outlook Bookings for
          scheduling and email).
        </LI>
        <LI>
          <strong>Authorities or third parties</strong> when required by law, to
          protect our rights, or in connection with a corporate transaction
          (e.g., merger or acquisition).
        </LI>
      </UL>

      <H2>6. International transfers</H2>
      <P>
        We are based in the United States and our providers may process data in
        the U.S. and other countries. Where required, we use appropriate
        safeguards (such as Standard Contractual Clauses) for cross-border
        transfers of personal information.
      </P>

      <H2>7. Data retention</H2>
      <P>
        We retain personal information for as long as needed to fulfill the
        purposes described above: access records and session data for the life
        of your access plus a reasonable period; use-case submissions for as
        long as we are evaluating or acting on them; and communications as
        needed for our business and legal requirements. We then delete or
        anonymize the data.
      </P>

      <H2>8. Your rights</H2>
      <P>
        Depending on where you live, you may have the right to access, correct,
        delete, or port your personal information; to object to or restrict
        certain processing; and to withdraw consent. California residents have
        rights under the CCPA/CPRA, including the right to know, delete, and
        correct, and the right to opt out of "sales" or "sharing" (we do
        neither). To exercise any right, contact{' '}
        <MailLink email={COMPANY.email.privacy} />. We will not discriminate
        against you for exercising your rights.
      </P>

      <H2>9. Security</H2>
      <P>
        We use administrative, technical, and physical safeguards — including
        encryption in transit, signed session tokens, row-level database
        security, and least-privilege access — to protect personal information.
        No method of transmission or storage is completely secure, and we cannot
        guarantee absolute security. Report concerns to{' '}
        <MailLink email={COMPANY.email.security} />.
      </P>

      <H2>10. Children&apos;s privacy</H2>
      <P>
        The Site is intended for business users and is not directed to children
        under 16. We do not knowingly collect personal information from
        children.
      </P>

      <H2>11. Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. We will revise the
        &ldquo;Last updated&rdquo; date above and, where appropriate, provide
        additional notice.
      </P>

      <H2>12. Contact us</H2>
      <P>
        Questions about this policy or our data practices? Email{' '}
        <MailLink email={COMPANY.email.privacy} /> or write to {COMPANY.legalName},{' '}
        {COMPANY.location}.
      </P>
    </>
  );
}
