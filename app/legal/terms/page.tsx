import type { Metadata } from 'next';
import { DocHeader, H2, P, UL, LI, MailLink, PageLink } from '@/components/legal/LegalDoc';
import { COMPANY, LEGAL_EFFECTIVE_DATE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `The terms governing your use of the Echelix Demo Hub, operated by ${COMPANY.legalName}.`,
};

export default function TermsPage() {
  return (
    <>
      <DocHeader
        title="Terms of Use"
        updated={LEGAL_EFFECTIVE_DATE}
        dateLabel="Effective date"
        intro={`These Terms of Use ("Terms") govern your access to and use of ${COMPANY.domain} and the Echelix Demo Hub (the "Service"), operated by ${COMPANY.legalName} ("Echelix," "we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.`}
      />

      <H2>1. Eligibility &amp; accounts</H2>
      <P>
        The Service is intended for business and professional use. You must be
        at least 16 years old and authorized to act on behalf of the
        organization you represent. You are responsible for the accuracy of the
        information you provide and for activity that occurs under your access
        credentials. Access codes and demo logins are personal to you and may
        not be shared.
      </P>

      <H2>2. The Service</H2>
      <P>
        The Service provides interactive demonstrations, solution
        documentation, architecture materials, and related content describing
        Echelix products and offerings. Demonstrations are provided for
        evaluation and illustrative purposes. Figures such as ROI estimates,
        timelines, and Azure consumption ranges are good-faith estimates for
        illustration only, are not guarantees, and actual results will vary.
      </P>

      <H2>3. Acceptable use</H2>
      <P>You agree not to:</P>
      <UL>
        <LI>Access or use the Service other than as permitted by these Terms or applicable law;</LI>
        <LI>Probe, scan, or test the vulnerability of the Service, or breach security or authentication measures;</LI>
        <LI>Scrape, harvest, or bulk-download content, or use automated means to access the Service except as expressly permitted;</LI>
        <LI>Reverse engineer, decompile, or attempt to derive source code from the Service except to the extent permitted by law;</LI>
        <LI>Interfere with or disrupt the integrity or performance of the Service; or</LI>
        <LI>Use the Service to infringe the rights of others or to transmit unlawful, harmful, or infringing content.</LI>
      </UL>

      <H2>4. Intellectual property</H2>
      <P>
        The Service and all content, software, trademarks, logos, and materials
        are owned by Echelix or its licensors and are protected by intellectual
        property laws. We grant you a limited, revocable, non-exclusive,
        non-transferable license to access and use the Service for your internal
        evaluation purposes. No other rights are granted.
      </P>

      <H2>5. Submissions</H2>
      <P>
        If you submit a use case, idea, or other feedback (a &ldquo;Submission&rdquo;),
        you grant Echelix a worldwide, royalty-free, perpetual, irrevocable
        license to use, reproduce, and incorporate the Submission for the
        purpose of evaluating, developing, and improving our products and
        services, including building a prototype where applicable. Do not
        include confidential information in a Submission unless we have a
        separate written agreement covering it. Your personal information in a
        Submission is handled under our{' '}
        <PageLink href="/legal/privacy">Privacy Policy</PageLink>.
      </P>

      <H2>6. Third-party services</H2>
      <P>
        The Service links to or embeds third-party services (for example,
        Microsoft Outlook Bookings and hosted demonstration environments). We
        are not responsible for third-party services, and your use of them is
        governed by their own terms and privacy policies.
      </P>

      <H2>7. Disclaimers</H2>
      <P>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
        WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
        INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
        SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
      </P>

      <H2>8. Limitation of liability</H2>
      <P>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, ECHELIX AND ITS AFFILIATES WILL
        NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
        PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT
        OF OR RELATED TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY
        CLAIM RELATING TO THE SERVICE WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS
        (US$100).
      </P>

      <H2>9. Indemnification</H2>
      <P>
        You agree to indemnify and hold harmless Echelix and its affiliates from
        any claims, damages, liabilities, and expenses (including reasonable
        legal fees) arising from your misuse of the Service or violation of
        these Terms.
      </P>

      <H2>10. Termination</H2>
      <P>
        We may suspend or terminate your access at any time, with or without
        notice, for any reason, including violation of these Terms. Provisions
        that by their nature should survive termination will survive.
      </P>

      <H2>11. Governing law &amp; disputes</H2>
      <P>
        These Terms are governed by the laws of the {COMPANY.governingLaw},
        without regard to conflict-of-laws principles. The state and federal
        courts located in {COMPANY.location} will have exclusive jurisdiction
        over any dispute arising out of these Terms or the Service, and you
        consent to their jurisdiction and venue.
      </P>

      <H2>12. Changes to these Terms</H2>
      <P>
        We may modify these Terms from time to time. Changes are effective when
        posted, and we will update the &ldquo;Last updated&rdquo; date above.
        Your continued use of the Service after changes take effect constitutes
        acceptance.
      </P>

      <H2>13. Contact</H2>
      <P>
        Questions about these Terms? Email <MailLink email={COMPANY.email.legal} />{' '}
        or write to {COMPANY.legalName}, {COMPANY.location}.
      </P>
    </>
  );
}
