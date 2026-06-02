import type { Metadata } from 'next';
import { DocHeader, H2, P, UL, LI, MailLink } from '@/components/legal/LegalDoc';
import { COMPANY, PRIVACY_EFFECTIVE_DATE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${COMPANY.legalName} collects, uses, and shares personal information.`,
};

export default function PrivacyPage() {
  return (
    <>
      <DocHeader
        title="Website Privacy Policy"
        updated={PRIVACY_EFFECTIVE_DATE}
        dateLabel="Effective date"
        intro={`Echelix, LLC ("Echelix," "we," or "us") provides this policy to explain how we handle personal information collected from people who contact us by phone or email and from visitors to our websites and mobile sites that link to this policy (our "sites").`}
      />

      <P>
        This policy, together with our Terms of Use, Cookie Policy, and any
        other documents that reference it, explains how we collect, use, and
        share any personal data, personally identifiable information, or
        personal information (&ldquo;personal data&rdquo;) that you provide to
        us or that we collect through our sites. This policy does not cover
        personal data we collect offline or personal data we process as a
        service provider for clients.
      </P>
      <P>
        California residents should also review our California Consumer Privacy
        Act Policy, which gives extra information and rights under California
        law.
      </P>
      <P>
        Residents of Colorado, Connecticut, Utah, or Virginia, review our US
        State Privacy Rights Addendum for your state-specific rights.
      </P>
      <P>
        When you contact us or submit an inquiry through our sites, your data
        will be collected and controlled by Echelix, LLC, a limited liability
        company based in the United States. We may share that data with our
        service providers as described in this policy.
      </P>
      <P>
        We operate a single office in the United States and serve customers and
        employees across the United States.
      </P>

      <H2>Information we collect about you</H2>
      <P>We collect and process the following types of personal data.</P>

      <H2>Information you give to us</H2>
      <P>
        This is information you give us by filling out forms on our sites or by
        contacting us by phone, email, or other methods. It includes
        information you provide when you:
      </P>
      <UL>
        <LI>request information about our services</LI>
        <LI>sign up for events, content, or updates</LI>
        <LI>join a webinar or other online session</LI>
        <LI>apply for a role with us</LI>
        <LI>report a problem with our sites</LI>
      </UL>
      <P>The information you give us may include your:</P>
      <UL>
        <LI>name</LI>
        <LI>company and job title</LI>
        <LI>business email address</LI>
        <LI>phone number</LI>
        <LI>mailing or billing address</LI>
        <LI>details about your business needs or use case</LI>
        <LI>resume, CV, or similar documents if you apply for a role</LI>
        <LI>any other information you choose to include in free text fields</LI>
      </UL>
      <P>
        Providing this information is your choice. If you do not provide it, we
        may not be able to respond or provide the services you request. You will
        know what personal data you provide because you submit it directly.
      </P>

      <H2>Information we collect automatically</H2>
      <P>
        To monitor and maintain the performance of our sites, analyze trends,
        and improve your experience, our sites may automatically collect,
        process, and store certain information, to the extent allowed under
        applicable law. This may include:
      </P>
      <UL>
        <LI>
          technical information such as your IP address, browser type and
          version, time zone setting, operating system, and platform
        </LI>
        <LI>
          information about your visit, such as pages viewed, clickstream data,
          date and time of visits, page response times, download errors, time
          spent on pages, page interaction (such as scrolling and clicks), and
          how you leave the page
        </LI>
        <LI>general location based on your IP address</LI>
      </UL>
      <P>
        This information is often collected using cookies and similar
        technologies.
      </P>

      <H2>Information we receive from other sources</H2>
      <P>We may receive information about you from third parties we work with, such as:</P>
      <UL>
        <LI>marketing and lead generation partners</LI>
        <LI>event hosts and co-sponsors</LI>
        <LI>recruitment platforms or agencies</LI>
        <LI>business partners that refer you to us</LI>
      </UL>
      <P>
        If we cannot collect certain information, that may affect our ability to
        provide the services or responses you have requested.
      </P>

      <H2>Cookies</H2>
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
      <P>
        Some web browsers offer a &ldquo;Do Not Track&rdquo; setting. There is
        no common standard for how to respond to these signals. At this time,
        our sites may not respond to these signals. You can manage some cookie
        choices in your browser and, where offered, in our cookie or privacy
        preference tools.
      </P>

      <H2>How we use your information</H2>
      <P>
        We may use the information we collect, including through AI tools such
        as generative AI and other technologies available to Echelix and our
        service providers, in the following ways, to the extent allowed under
        applicable law.
      </P>

      <H2>Information you give to us</H2>
      <P>We may use this information:</P>
      <UL>
        <LI>to respond to your requests and provide the information, products, and services you request</LI>
        <LI>to manage and perform any contract we have with you or your company</LI>
        <LI>to provide you with information about other services that are similar to those you have already purchased or asked about, when allowed by law</LI>
        <LI>to send you information about services we believe may interest you, when we have your consent if required by law. We may contact you by email, phone, SMS, or other electronic means</LI>
        <LI>to plan and manage events, webinars, and meetings</LI>
        <LI>to evaluate and process job applications</LI>
        <LI>to notify you about changes to services or policies</LI>
        <LI>to present content from our sites in the most effective way for you and your device</LI>
      </UL>

      <H2>Information we collect about you</H2>
      <P>We may use this information:</P>
      <UL>
        <LI>to administer our sites and for internal operations, including troubleshooting, data analysis, testing, research, and statistics</LI>
        <LI>to improve our sites and keep them working well</LI>
        <LI>to help keep our sites safe and secure</LI>
        <LI>to measure or understand the effectiveness of our marketing and advertising</LI>
        <LI>to deliver content and ads that may be more relevant to your interests</LI>
      </UL>

      <H2>Information we receive from other sources</H2>
      <P>
        We may combine information we receive from third parties with
        information you provide and information we collect automatically. We
        will use the combined information for the purposes set out above, when
        allowed by law.
      </P>

      <H2>Disclosure of your information</H2>
      <P>To the extent allowed under applicable law, we may share your personal data with:</P>
      <UL>
        <LI>cloud hosting, data storage, and IT service providers that help us run our sites and systems</LI>
        <LI>security and monitoring providers that support safety and incident response</LI>
        <LI>marketing, analytics, and advertising partners that help us measure performance and reach the right audience. We may share aggregated or de identified information with them</LI>
        <LI>event and webinar platforms that help us host events and manage registrations</LI>
        <LI>recruiting tools and background screening providers used in hiring, where allowed by law</LI>
        <LI>professional advisors such as lawyers, auditors, and insurers, as needed for their services</LI>
      </UL>
      <P>We may also share your personal data:</P>
      <UL>
        <LI>if we sell or buy a business or assets. Your personal data may be shared with the buyer or seller as part of that process</LI>
        <LI>if Echelix, LLC or its assets are acquired by a third party. In that case, personal data about our customers may be transferred as part of the transaction</LI>
        <LI>if we are required to do so by law or legal process, or to respond to valid requests by public authorities</LI>
        <LI>to enforce or apply our Terms of Use and other agreements</LI>
        <LI>to protect the rights, property, or safety of Echelix, our employees, our customers, or others</LI>
      </UL>
      <P>
        We do not sell personal data and do not share personal data for cross
        context behavioral advertising as those terms are defined by California
        law.
      </P>

      <H2>Transfers of information outside your state or country</H2>
      <P>
        We are based in the United States. Your personal data may be stored and
        processed in the United States or in other countries where our service
        providers are located. These locations may have data protection laws
        that differ from the laws in your state or country. We take reasonable
        steps to help ensure that your personal data is protected in line with
        this policy and applicable law. This may include written data protection
        terms with our service providers.
      </P>

      <H2>Data security</H2>
      <P>
        We use reasonable technical and organizational measures to help protect
        your personal data from loss, misuse, and unauthorized access,
        disclosure, change, and destruction. These measures take into account
        the nature of the data and the risks involved. No method of transmission
        or storage is perfectly secure, and we cannot guarantee absolute
        security.
      </P>

      <H2>Data retention</H2>
      <P>We keep your personal data for as long as needed to:</P>
      <UL>
        <LI>provide the services you requested</LI>
        <LI>support our business purposes described in this policy</LI>
        <LI>comply with legal, tax, accounting, or reporting duties</LI>
        <LI>resolve disputes and enforce our agreements</LI>
      </UL>
      <P>
        In many cases this will not be longer than five years from the date of
        collection, plus any added time needed for legal holds, backup
        retention, or required recordkeeping.
      </P>
      <P>
        When we no longer need your personal data for these purposes, we will
        remove it from our systems or take steps to de-identify it, unless we
        must keep it for longer under applicable law.
      </P>

      <H2>Your choices and rights</H2>
      <P>
        Depending on where you live, you may have certain rights regarding your
        personal data under United States state laws. These may include rights
        to:
      </P>
      <UL>
        <LI>request access to your personal data</LI>
        <LI>request correction of inaccurate personal data</LI>
        <LI>request deletion of your personal data</LI>
        <LI>opt out of certain uses or disclosures such as targeted advertising or the sale of personal data, if applicable</LI>
        <LI>withdraw consent where we rely on consent</LI>
      </UL>
      <P>
        If you are a California resident, you also have specific rights under the
        CCPA. Please see our California Consumer Privacy Act Policy for details
        on those rights and how to exercise them.
      </P>
      <P>
        To exercise your rights or ask questions about them, contact us using
        the information in the &ldquo;Contacts and complaints&rdquo; section. We
        may need to verify your identity before fulfilling your request. We may
        deny or limit a request where allowed by law and will explain why if we
        do.
      </P>
      <P>
        You may also opt out of marketing emails using the unsubscribe link in
        those emails. Even if you opt out, we may still send non-marketing
        messages related to your existing relationship with us.
      </P>

      <H2>Children&apos;s privacy</H2>
      <P>
        Our sites are not directed to children under 13, and we do not knowingly
        collect personal data from children under 13. If you believe a child has
        provided us personal data, please contact us so we can delete it.
      </P>

      <H2>Contacts and complaints</H2>
      <P>
        We rely on personal data provided by you. To help keep your information
        current, complete, and accurate, please tell us if your personal data
        changes.
      </P>
      <P>
        Questions, comments, or requests regarding this privacy policy are
        welcome. You can contact us at:
      </P>
      <P>
        Email: <MailLink email={COMPANY.email.privacy} />
        <br />
        Mail:
        <br />
        Echelix, LLC
        <br />
        1141 E. Glendale Ave number 1004
        <br />
        Phoenix, AZ 85020
        <br />
        United States
      </P>
      <P>
        If you have a complaint about our privacy practices, please contact us
        using the details above. You may also have the right to contact your
        state attorney general or other privacy authority in your state.
      </P>

      <H2>Changes to this privacy policy</H2>
      <P>
        We may update this policy from time to time. When we do, we will change
        the &ldquo;Effective date&rdquo; above and, when required by law, provide
        additional notice.
      </P>
    </>
  );
}
