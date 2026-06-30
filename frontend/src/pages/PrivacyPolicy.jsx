import PageHero from "@/components/PageHero";
import ScrollSection from "@/components/ScrollSection";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";

const LAST_UPDATED = "June 30, 2026";
const CONTACT_EMAIL = "imran@wehelpautomate.com";

const SECTIONS = [
  {
    n: 1,
    heading: "Introduction",
    paras: [
      'We Help Automate ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website leftclick.ai or engage our services.',
    ],
  },
  {
    n: 2,
    heading: "Information We Collect",
    paras: [
      "Personal Information: When you book a call, fill out a form, or contact us, we may collect your name, email address, phone number, company name, and job title.",
      "Usage Data: We automatically collect information about your device, browser, IP address, pages visited, and referring URLs through cookies and similar technologies.",
      "Communications: If you email us or use our chat, we retain the content of those communications.",
    ],
  },
  {
    n: 3,
    heading: "How We Use Your Information",
    paras: [
      "We use collected information to: provide and improve our services; respond to inquiries and schedule calls; send relevant updates (with your consent); analyze website usage and optimize performance; comply with legal obligations.",
    ],
  },
  {
    n: 4,
    heading: "Sharing of Information",
    paras: [
      "We do not sell your personal information. We may share data with: service providers who assist our operations (hosting, analytics, scheduling); professional advisors (legal, accounting); as required by law or to protect our rights.",
    ],
  },
  {
    n: 5,
    heading: "Cookies",
    paras: [
      "We use essential cookies for site functionality and analytics cookies to understand usage patterns. You can control cookie preferences through your browser settings.",
    ],
  },
  {
    n: 6,
    heading: "Data Security",
    paras: [
      "We implement appropriate technical and organizational measures to protect your information. However, no electronic transmission or storage is 100% secure.",
    ],
  },
  {
    n: 7,
    heading: "Data Retention",
    paras: [
      "We retain personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.",
    ],
  },
  {
    n: 8,
    heading: "Your Rights",
    paras: [
      "Depending on your jurisdiction, you may have the right to: access, correct, or delete your personal information; opt out of marketing communications; request data portability. To exercise these rights, contact us at " + CONTACT_EMAIL + ".",
    ],
  },
  {
    n: 9,
    heading: "Changes to This Policy",
    paras: [
      "We may update this policy from time to time. Changes will be posted on this page with an updated revision date.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div data-testid="privacy-policy-page" className="overflow-x-hidden">
      <Seo
        title="Privacy Policy"
        description="How We Help Automate collects, uses, and safeguards your information."
        path="/privacy-policy"
      />
      <PageHero
        kicker="Legal"
        title="Privacy"
        italicWord="Policy."
        subtitle={`Last updated: ${LAST_UPDATED}`}
        showForm={false}
      />

      <ScrollSection direction="left" settle depth={0} intensity={0.4}>
        <section className="section-glass relative section-solid py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="space-y-10">
              {SECTIONS.map((s) => (
                <Reveal key={s.n}>
                  <section data-testid={`privacy-section-${s.n}`}>
                    <h2 className="weha-display text-2xl text-weha-text">
                      {s.n}. {s.heading}
                    </h2>
                    <div className="mt-3 space-y-3">
                      {s.paras.map((p, i) => (
                        <p key={i} className="text-weha-muted leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}

              <Reveal>
                <section data-testid="privacy-section-10">
                  <h2 className="weha-display text-2xl text-weha-text">10. Contact</h2>
                  <div className="mt-3 space-y-1 text-weha-muted leading-relaxed">
                    <p>If you have questions about this Privacy Policy, contact us at:</p>
                    <p className="text-weha-text">We Help Automate</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-weha-teal hover:underline"
                      data-testid="privacy-contact-email"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </section>
              </Reveal>
            </div>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
}
