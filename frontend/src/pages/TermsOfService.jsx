import PageHero from "@/components/PageHero";
import ScrollSection from "@/components/ScrollSection";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import { ORG, WEBSITE, breadcrumb, webPage, graph } from "@/lib/seoSchemas";

const LAST_UPDATED = "March 17, 2026";
const CONTACT_EMAIL = "imran@wehelpautomate.com";

const SECTIONS = [
  {
    n: 1,
    heading: "Agreement to Terms",
    paras: [
      'By accessing or using the services provided by We Help Automate Inc. ("Company," "we," "us"), you agree to be bound by these Terms of Service. If you do not agree, do not use our services.',
    ],
  },
  {
    n: 2,
    heading: "Services",
    paras: [
      "We Help Automate provides AI-driven automation, systems implementation, and performance optimization services for businesses. The scope of work for each engagement is defined in a separate Statement of Work or service agreement.",
    ],
  },
  {
    n: 3,
    heading: "Client Obligations",
    paras: [
      "You agree to: provide accurate and complete information; grant reasonable access to systems and data necessary for service delivery; make timely payments as outlined in your service agreement; designate a point of contact for communications.",
    ],
  },
  {
    n: 4,
    heading: "Intellectual Property",
    paras: [
      "Unless otherwise stated in a service agreement: custom work product created specifically for you is assigned to you upon full payment; pre-existing tools, frameworks, and methodologies remain the property of We Help Automate; we retain the right to use general knowledge and techniques gained during engagements.",
    ],
  },
  {
    n: 5,
    heading: "Payment Terms",
    paras: [
      "Payment terms are specified in individual service agreements. Late payments may incur interest at 1.5% per month. We reserve the right to suspend services for overdue accounts.",
    ],
  },
  {
    n: 6,
    heading: "Confidentiality",
    paras: [
      "Both parties agree to keep confidential any proprietary or sensitive information shared during the engagement. This obligation survives termination of the agreement.",
    ],
  },
  {
    n: 7,
    heading: "Limitation of Liability",
    paras: [
      "To the maximum extent permitted by law, We Help Automate's total liability for any claim arising from our services shall not exceed the fees paid by you in the twelve months preceding the claim. We are not liable for indirect, incidental, or consequential damages.",
    ],
  },
  {
    n: 8,
    heading: "Termination",
    paras: [
      "Either party may terminate a service engagement with 30 days written notice. Upon termination, you are responsible for payment for all services rendered up to the termination date.",
    ],
  },
  {
    n: 9,
    heading: "Governing Law",
    paras: [
      "These Terms are governed by the laws of the state of Maharashtra, India. Any disputes shall be resolved in the courts of Pune, Maharashtra, India.",
    ],
  },
  {
    n: 10,
    heading: "Changes to Terms",
    paras: [
      "We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the revised Terms.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div data-testid="terms-of-service-page" className="overflow-x-hidden">
      <Seo
        title="Terms of Service"
        description="The terms that govern your use of We Help Automate services."
        path="/terms-of-service"
        jsonLd={graph([
          ORG,
          WEBSITE,
          webPage({
            path: "/terms-of-service",
            name: "Terms of Service",
            description:
              "The terms that govern your use of We Help Automate services.",
          }),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms-of-service" },
          ], "/terms-of-service"),
        ])}
      />
      <PageHero
        kicker="Legal"
        title="Terms of"
        italicWord="Service."
        subtitle={`Last updated: ${LAST_UPDATED}`}
        showForm={false}
      />

      <ScrollSection direction="left" settle depth={0} intensity={0.4}>
        <section className="section-glass relative section-solid py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="space-y-10">
              {SECTIONS.map((s) => (
                <Reveal key={s.n}>
                  <section data-testid={`terms-section-${s.n}`}>
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
                <section data-testid="terms-section-11">
                  <h2 className="weha-display text-2xl text-weha-text">11. Contact</h2>
                  <div className="mt-3 space-y-1 text-weha-muted leading-relaxed">
                    <p>Questions about these Terms? Contact us at:</p>
                    <p className="text-weha-text">We Help Automate Inc.</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-weha-teal hover:underline"
                      data-testid="terms-contact-email"
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
