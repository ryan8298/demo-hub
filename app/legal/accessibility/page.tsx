import type { Metadata } from 'next';
import { DocHeader, H2, P, UL, LI, MailLink } from '@/components/legal/LegalDoc';
import { COMPANY, LEGAL_EFFECTIVE_DATE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: `${COMPANY.legalName}'s commitment to digital accessibility on the Echelix Demo Hub.`,
};

export default function AccessibilityPage() {
  return (
    <>
      <DocHeader
        title="Accessibility Statement"
        updated={LEGAL_EFFECTIVE_DATE}
        intro={`${COMPANY.legalName} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to the Echelix Demo Hub.`}
      />

      <H2>Our standard</H2>
      <P>
        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA. These guidelines explain how to make web content more
        accessible to people with a wide range of disabilities, including
        visual, auditory, physical, speech, cognitive, and neurological
        disabilities.
      </P>

      <H2>What we do</H2>
      <UL>
        <LI>Semantic, keyboard-navigable markup with visible focus states.</LI>
        <LI>Modals with focus trapping, escape-to-close, and restored focus on close.</LI>
        <LI>Descriptive labels and alternative text for meaningful images and controls.</LI>
        <LI>Color choices and contrast intended to remain legible across the interface.</LI>
        <LI>Respect for reduced-motion preferences where animation is used.</LI>
      </UL>

      <H2>Known limitations</H2>
      <P>
        Some interactive demonstrations embedded in the Demo Hub are hosted on
        third-party platforms whose accessibility we do not fully control. We
        flag this so you know what to expect, and we are happy to provide an
        alternative walkthrough on request.
      </P>

      <H2>Feedback &amp; assistance</H2>
      <P>
        We welcome your feedback on the accessibility of the Echelix Demo Hub.
        If you encounter a barrier, or need information or a demonstration
        provided in an alternative format, please contact us at{' '}
        <MailLink email={COMPANY.email.accessibility} />. Please describe the
        issue and the page involved so we can respond quickly. We aim to
        acknowledge accessibility requests within five business days.
      </P>

      <H2>Ongoing effort</H2>
      <P>
        Accessibility is an ongoing commitment. We periodically review the Site
        and address issues as part of our normal development process. This
        statement will be updated as our practices evolve.
      </P>
    </>
  );
}
