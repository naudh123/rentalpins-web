import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { appPath } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "RentalPins terms and conditions — listings, platform usage, payments and policies for our map-based rental marketplace in India and international hubs.",
  keywords: ["RentalPins terms", "rental platform terms India"],
  alternates: {
    canonical: canonicalUrl("/terms"),
  },
  openGraph: {
    title: "Terms & Conditions | RentalPins",
    description: "Terms of use for the RentalPins rental marketplace.",
    url: canonicalUrl("/terms"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms | RentalPins",
    description: "RentalPins platform terms and conditions.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function Terms() {
  return (
    <MarketingShell>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-10">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1E3A6E] font-serif">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last Updated: May 10, 2026
        </p>

        <div className="mt-10 space-y-4 text-slate-600 leading-relaxed">
          <p>
            Welcome to{" "}
            <span className="text-[#1E3A6E] font-semibold">RentalPins</span>. These
            Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and
            use of the RentalPins website at{" "}
            <a
              href="https://www.rentalpins.com"
              className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
            >
              www.rentalpins.com
            </a>{" "}
            and the RentalPins mobile application (collectively, the
            &quot;Platform&quot;), operated by{" "}
            <span className="text-[#1E3A6E] font-semibold">Shimle Ale Sardar</span>{" "}
            (a registered Partnership Firm), trading as RentalPins (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p>
            By accessing or using the Platform, you agree to be bound by these
            Terms. If you do not agree, please do not use the Platform.
          </p>
        </div>

        {/* Section 1 */}
        <Section number="1" title="Definitions">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">
                &quot;Platform&quot;
              </span>{" "}
              refers to the RentalPins website and mobile application, including
              all content, features, and services offered through them.
            </li>
            <li>
              <span className="text-slate-900 font-medium">&quot;User&quot;</span>{" "}
              refers to any individual or entity that accesses or uses the
              Platform, whether as a Lister, Renter, or visitor.
            </li>
            <li>
              <span className="text-slate-900 font-medium">&quot;Lister&quot;</span>{" "}
              refers to a User who creates and publishes rental listings on the
              Platform.
            </li>
            <li>
              <span className="text-slate-900 font-medium">&quot;Renter&quot;</span>{" "}
              refers to a User who browses, books, or engages with rental
              listings on the Platform.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                &quot;Listing&quot;
              </span>{" "}
              refers to any property, item, service, or asset posted for rental
              on the Platform by a Lister.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                &quot;Transaction&quot;
              </span>{" "}
              refers to any booking, rental agreement, or payment made between a
              Lister and a Renter through the Platform.
            </li>
          </ul>
        </Section>

        {/* Section 2 */}
        <Section number="2" title="Nature of the Platform">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 mb-4">
            <p className="text-slate-600 leading-relaxed">
              RentalPins is a{" "}
              <span className="text-[#1E3A6E] font-semibold">
                technology marketplace platform
              </span>{" "}
              that connects Listers with Renters. We do not own, manage,
              operate, or control any of the properties, items, or services
              listed on the Platform. RentalPins acts solely as an intermediary
              to facilitate rental discovery and transactions between Users.
            </p>
          </div>
          <p className="text-slate-600">
            We are not a party to any rental agreement between Listers and
            Renters. Any contract formed as a result of a Transaction is solely
            between the Lister and the Renter. RentalPins is not responsible for
            the quality, safety, legality, or availability of any Listing.
          </p>
        </Section>

        {/* Section 3 */}
        <Section number="3" title="Eligibility">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              You must be at least{" "}
              <span className="text-slate-900 font-medium">18 years of age</span>{" "}
              to create an account and use the Platform.
            </li>
            <li>
              By registering, you represent that you are legally competent to
              enter into binding agreements under applicable law in your
              jurisdiction.
            </li>
            <li>
              If you are using the Platform on behalf of a business or
              organization, you represent that you have the authority to bind
              that entity to these Terms.
            </li>
            <li>
              We reserve the right to refuse service, terminate accounts, or
              cancel Transactions at our sole discretion if we believe a User
              does not meet these eligibility requirements.
            </li>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section number="4" title="Account Registration and Verification">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              To access most features of the Platform, you must create an
              account by providing your name, email address, and mobile phone
              number.
            </li>
            <li>
              Your mobile number will be verified via a{" "}
              <span className="text-slate-900 font-medium">
                One-Time Password (OTP)
              </span>{" "}
              sent by SMS. Verification is mandatory for account activation.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account.
            </li>
            <li>
              You agree to provide accurate, current, and complete information
              during registration and to update it as necessary.
            </li>
            <li>
              You must notify us immediately at{" "}
              <a
                href="mailto:support@rentalpins.com"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                support@rentalpins.com
              </a>{" "}
              if you suspect any unauthorized use of your account.
            </li>
            <li>
              We reserve the right to suspend or terminate your account if any
              information provided is found to be inaccurate, misleading, or
              fraudulent.
            </li>
          </ul>
        </Section>

        {/* Section 5 */}
        <Section number="5" title="Listings and Lister Responsibilities">
          <p className="text-slate-600 mb-3">
            If you create a Listing on the Platform, you agree to the following:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              You are the lawful owner of the listed item/property or have
              explicit authorization from the owner to list it for rental.
            </li>
            <li>
              All information, photos, pricing, and descriptions in your Listing
              must be accurate, complete, and not misleading.
            </li>
            <li>
              You are solely responsible for setting rental terms, pricing,
              availability, and any conditions applicable to your Listing.
            </li>
            <li>
              Your Listing must not include any property, item, or service that
              is illegal, stolen, hazardous, prohibited, or violates any
              applicable law or regulation.
            </li>
            <li>
              You must comply with all local, state, and national laws,
              regulations, tax obligations, and licensing requirements applicable
              to your rental activity.
            </li>
            <li>
              You are responsible for the condition, maintenance, and safety of
              the listed item or property. RentalPins bears no liability for
              damages, injuries, or disputes arising from a rental.
            </li>
            <li>
              We reserve the right to remove or de-list any Listing that
              violates these Terms, our policies, or applicable law — without
              prior notice.
            </li>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section number="6" title="Renter Responsibilities">
          <p className="text-slate-600 mb-3">
            If you book or rent through the Platform, you agree to the following:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              You are responsible for independently verifying the accuracy,
              suitability, and condition of any Listing before entering into a
              Transaction.
            </li>
            <li>
              You agree to use rented items or properties responsibly and return
              them in the same condition as received, unless otherwise agreed
              with the Lister.
            </li>
            <li>
              You must comply with any rental terms, rules, or conditions set by
              the Lister.
            </li>
            <li>
              Any disputes arising from a rental are to be resolved directly
              between the Renter and the Lister. While RentalPins may offer
              mediation assistance, we are not obligated to resolve disputes.
            </li>
            <li>
              You must not use rented items or properties for any illegal,
              unauthorized, or harmful purpose.
            </li>
          </ul>
        </Section>

        {/* Section 7 */}
        <Section number="7" title="Payments and Fees">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              All payments on the Platform are processed securely through{" "}
              <span className="text-slate-900 font-medium">Razorpay</span>. By
              making a payment, you also agree to Razorpay&apos;s terms of
              service.
            </li>
            <li>
              Rental pricing is set by the Lister. RentalPins may charge a
              service fee or commission on Transactions, which will be clearly
              disclosed before payment.
            </li>
            <li>
              All prices displayed on the Platform are shown in the local
              currency applicable to your region unless otherwise specified.
              Currency conversions, if any, are approximate and may vary based
              on your payment provider.
            </li>
            <li>
              You are responsible for any applicable taxes, duties, or charges
              arising from your rental activity.
            </li>
            <li>
              RentalPins does not store your full credit/debit card numbers or
              bank account details. All sensitive payment data is handled
              exclusively by Razorpay in accordance with PCI-DSS standards.
            </li>
          </ul>
        </Section>

        {/* Section 8 */}
        <Section number="8" title="Cancellations and Refunds">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              Cancellation policies for individual Listings are set by the
              Lister and should be reviewed before booking.
            </li>
            <li>
              If a Lister cancels a confirmed booking, the Renter will be
              entitled to a full refund of the amount paid.
            </li>
            <li>
              If a Renter cancels a booking, the refund amount (if any) will
              depend on the Lister&apos;s cancellation policy and the timing of
              the cancellation.
            </li>
            <li>
              Refunds, when applicable, will be processed through the original
              payment method via Razorpay. Processing times may vary based on
              your bank or payment provider.
            </li>
            <li>
              RentalPins reserves the right to issue refunds or credits at its
              sole discretion in cases of disputes, fraud, or platform errors.
            </li>
          </ul>
        </Section>

        {/* Section 9 */}
        <Section number="9" title="Location-Based Services">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              The Platform uses GPS and location data to power features such as
              nearby rental discovery, map-based listing display, and
              distance-based search.
            </li>
            <li>
              By enabling location access, you consent to the collection and use
              of your device&apos;s location data as described in our{" "}
              <Link
                href={appPath("/privacy-policy")}
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </li>
            <li>
              Location data is used to provide relevant, nearby results and is
              not used for tracking or surveillance purposes.
            </li>
            <li>
              You may disable location access through your device settings at
              any time, though this may limit certain Platform features.
            </li>
          </ul>
        </Section>

        {/* Section 10 */}
        <Section number="10" title="Prohibited Conduct">
          <p className="text-slate-600 mb-3">
            You agree not to engage in any of the following activities while
            using the Platform:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              Posting false, inaccurate, misleading, or fraudulent Listings or
              information.
            </li>
            <li>
              Using the Platform for any unlawful, illegal, or unauthorized
              purpose.
            </li>
            <li>
              Harassing, threatening, defaming, or abusing other Users.
            </li>
            <li>
              Attempting to circumvent the Platform&apos;s payment system to
              avoid fees (e.g., arranging off-platform payments).
            </li>
            <li>
              Scraping, crawling, or using automated tools to extract data from
              the Platform without prior written consent.
            </li>
            <li>
              Uploading content that infringes intellectual property rights,
              contains malware, or violates any third party&apos;s rights.
            </li>
            <li>
              Creating multiple accounts, fake accounts, or impersonating
              another person or entity.
            </li>
            <li>
              Interfering with or disrupting the Platform&apos;s infrastructure,
              security, or other Users&apos; experience.
            </li>
            <li>
              Listing any prohibited, illegal, hazardous, or stolen items or
              properties.
            </li>
          </ul>
          <p className="text-slate-600 mt-4">
            Violation of these rules may result in immediate suspension or
            termination of your account, removal of your Listings, and/or legal
            action as deemed appropriate.
          </p>
        </Section>

        {/* Section 11 */}
        <Section number="11" title="Intellectual Property">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              All content on the Platform — including the name
              &quot;RentalPins,&quot; logo, design, text, graphics, software,
              and code — is the property of Shimle Ale Sardar or its licensors
              and is protected by applicable intellectual property laws.
            </li>
            <li>
              You may not copy, modify, distribute, sell, or create derivative
              works from any part of the Platform without our prior written
              consent.
            </li>
            <li>
              By posting a Listing or content on the Platform, you grant
              RentalPins a non-exclusive, worldwide, royalty-free license to use,
              display, reproduce, and distribute that content solely for the
              purpose of operating and promoting the Platform.
            </li>
            <li>
              You retain ownership of any content you post but are responsible
              for ensuring it does not infringe any third party&apos;s
              intellectual property rights.
            </li>
          </ul>
        </Section>

        {/* Section 12 */}
        <Section number="12" title="Disclaimer of Warranties">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3 text-slate-600">
            <p>
              The Platform is provided on an{" "}
              <span className="text-slate-900 font-medium">
                &quot;AS IS&quot;
              </span>{" "}
              and{" "}
              <span className="text-slate-900 font-medium">
                &quot;AS AVAILABLE&quot;
              </span>{" "}
              basis. To the fullest extent permitted by law, RentalPins disclaims
              all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Warranties of merchantability, fitness for a particular purpose,
                and non-infringement.
              </li>
              <li>
                Any warranty that the Platform will be uninterrupted,
                error-free, secure, or free from viruses or harmful components.
              </li>
              <li>
                Any warranty regarding the accuracy, reliability, or
                completeness of any Listing, User content, or information on the
                Platform.
              </li>
            </ul>
            <p>
              We do not guarantee that any rental Transaction will be completed
              successfully, or that any Listing will meet your expectations.
            </p>
          </div>
        </Section>

        {/* Section 13 */}
        <Section number="13" title="Limitation of Liability">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              To the maximum extent permitted by applicable law, RentalPins, its
              partners, employees, and affiliates shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising out of or related to your use of the Platform.
            </li>
            <li>
              This includes, but is not limited to, damages for loss of profits,
              data, goodwill, or other intangible losses — even if we have been
              advised of the possibility of such damages.
            </li>
            <li>
              Our total aggregate liability for any claims arising under these
              Terms shall not exceed the amount you paid to RentalPins (if any)
              in the 12 months preceding the claim.
            </li>
            <li>
              RentalPins is not liable for any loss, damage, injury, or dispute
              arising from Transactions between Listers and Renters, including
              issues related to the condition, quality, legality, or safety of
              Listings.
            </li>
          </ul>
        </Section>

        {/* Section 14 */}
        <Section number="14" title="Indemnification">
          <p className="text-slate-600">
            You agree to indemnify, defend, and hold harmless RentalPins, Shimle
            Ale Sardar, its partners, employees, and affiliates from and against
            any claims, liabilities, damages, losses, costs, or expenses
            (including reasonable legal fees) arising out of or in connection
            with: (a) your use of the Platform; (b) your violation of these
            Terms; (c) your violation of any applicable law or regulation; (d)
            any Listing or content you post; or (e) any Transaction or dispute
            between you and another User.
          </p>
        </Section>

        {/* Section 15 */}
        <Section number="15" title="Termination">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              You may terminate your account at any time by contacting us at{" "}
              <a
                href="mailto:support@rentalpins.com"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                support@rentalpins.com
              </a>{" "}
              or through the account settings in the app.
            </li>
            <li>
              We may suspend or terminate your account and access to the
              Platform at any time, with or without notice, if you violate these
              Terms, engage in prohibited conduct, or for any other reason at our
              sole discretion.
            </li>
            <li>
              Upon termination, your right to use the Platform ceases
              immediately. Any pending Transactions may be cancelled, and any
              outstanding obligations (such as payments owed) shall survive
              termination.
            </li>
            <li>
              Sections relating to Intellectual Property, Disclaimer of
              Warranties, Limitation of Liability, Indemnification, and
              Governing Law and Dispute Resolution shall survive the termination of these Terms.
            </li>
          </ul>
        </Section>

        {/* Section 16 */}
        <Section number="16" title="Modifications to Terms">
          <p className="text-slate-600">
            We reserve the right to update or modify these Terms at any time.
            When we make material changes, we will post the updated Terms on the
            Platform with a revised &quot;Last Updated&quot; date. Where
            appropriate, we may also notify you via email or in-app
            notification. Your continued use of the Platform after changes are
            posted constitutes your acceptance of the revised Terms. We
            encourage you to review these Terms periodically.
          </p>
        </Section>

        {/* Section 17 — Listing verification & trust */}
        <Section number="17" title="Listing verification, trust &amp; fraud prevention">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 mb-4 space-y-3 text-slate-600">
            <p>
              RentalPins uses a combination of{" "}
              <span className="text-slate-900 font-medium">account verification</span>{" "}
              (for example mobile OTP), automated technical checks, user reports,
              and operational review to reduce fraudulent or misleading listings.
              Measures may change over time as our systems evolve.
            </p>
            <p>
              <span className="text-slate-900 font-medium">We do not guarantee</span>{" "}
              the accuracy, completeness, legality, safety, or fitness of any
              Listing, the identity of any User, or the outcome of any rental. You
              are responsible for your own diligence — including where
              appropriate viewing the property or item, confirming ownership or
              authority to rent, checking documents, and using secure payment and
              communication practices.
            </p>
            <p>
              If you believe a Listing or User violates these Terms or applicable
              law, report it to us at{" "}
              <a
                href="mailto:support@rentalpins.com"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                support@rentalpins.com
              </a>
              . We may remove or restrict content or accounts when justified by our
              policies or legal obligations.
            </p>
          </div>
          <p className="text-slate-600 text-sm">
            Nothing in this Section is legal advice. For tenancy deposits, HMO
            licensing, consumer rights, or data protection questions, consult a
            qualified professional in your jurisdiction.
          </p>
        </Section>

        {/* Section 18 — Regional housing & consumer context */}
        <Section number="18" title="Regional housing regulation &amp; consumer law (non-exhaustive)">
          <p className="text-slate-600 mb-4">
            RentalPins operates globally from India but serves Users in multiple
            countries. Local housing and consumer rules may apply to your rental
            activity <span className="text-slate-900 font-medium">in addition</span>{" "}
            to these Terms. The summaries below are for orientation only and may be
            incomplete or change as laws evolve. They do not replace professional
            advice.
          </p>
          <ul className="space-y-4 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">India:</span> Listers and
              Renters remain responsible for compliance with applicable central,
              state and local laws (including rent control where it exists), tax,
              and stamp-duty requirements. Our Grievance Officer details appear in
              the Privacy Policy for IT Act-related grievances.
            </li>
            <li>
              <span className="text-slate-900 font-medium">United Kingdom:</span>{" "}
              Private residential tenancies in England &amp; Wales are subject to
              statutory frameworks (for example assured shorthold tenancies,
              deposit protection rules, and landlord licensing in certain areas).
              Listers advertising property in the UK must comply with applicable
              landlord, safety, anti-discrimination and advertising rules. Renters
              should verify tenancy type, deposit protection, and safety
              certificates before committing. Mandatory rights under the Consumer
              Rights Act 2015 and UK GDPR / Data Protection Act 2018 are not limited
              by these Terms where the law says they cannot be.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Kenya:</span> Housing and
              commercial rentals may be subject to county bylaws, lease and
              contract law, and sector-specific regulation. The Data Protection Act,
              2019 and regulations issued thereunder may grant data-subject rights
              that apply alongside this Policy. The Competition Authority of Kenya
              and other agencies may have consumer-protection mandates relevant to
              marketplace conduct.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Nigeria:</span> Rentals may
              implicate state tenancy practices, contract law, and (where
              applicable) consumer-protection frameworks including the Federal
              Competition and Consumer Protection Act 2018. The Nigeria Data
              Protection Act 2023 and NDPR-derived rules may apply to personal data
              processing. Users should verify titles, agency relationships, and
              charges before paying.
            </li>
          </ul>
        </Section>

        {/* Section 19 */}
        <Section number="19" title="Governing Law and Dispute Resolution">
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              These Terms shall be governed by and construed in accordance with
              the laws of{" "}
              <span className="text-slate-900 font-medium">India</span>, without
              regard to its conflict of law provisions, as RentalPins is
              operated by a firm registered in India.
            </li>
            <li>
              If you are accessing the Platform from outside India, you are
              responsible for compliance with your local laws to the extent they
              are applicable. Nothing in these Terms limits any rights you may
              have under the mandatory consumer protection laws of your
              jurisdiction.
            </li>
            <li>
              Any disputes arising out of or in connection with these Terms or
              your use of the Platform shall first be attempted to be resolved
              amicably through negotiation.
            </li>
            <li>
              If a dispute cannot be resolved amicably within 30 days, it shall
              generally be subject to the exclusive jurisdiction of the courts
              located in{" "}
              <span className="text-slate-900 font-medium">
                Ludhiana, Punjab, India
              </span>
              , subject to any{" "}
              <span className="text-slate-900 font-medium">
                mandatory forum or consumer rules
              </span>{" "}
              in the United Kingdom, Kenya, Nigeria, or elsewhere that apply to
              you as a consumer or small business and cannot be waived by
              contract.
            </li>
          </ul>
        </Section>

        {/* Section 20 */}
        <Section number="20" title="Severability">
          <p className="text-slate-600">
            If any provision of these Terms is found to be invalid, illegal, or
            unenforceable by a court of competent jurisdiction, such provision
            shall be modified to the minimum extent necessary to make it
            enforceable, and the remaining provisions shall continue in full
            force and effect.
          </p>
        </Section>

        {/* Section 21 */}
        <Section number="21" title="Entire Agreement">
          <p className="text-slate-600">
            These Terms, together with the{" "}
            <Link
              href={appPath("/privacy-policy")}
              className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
            >
              Privacy Policy
            </Link>{" "}
            and any other policies referenced herein, constitute the entire
            agreement between you and RentalPins regarding your use of the
            Platform, and supersede all prior agreements, understandings, or
            representations — whether written or oral.
          </p>
        </Section>

        {/* Section 22 */}
        <Section number="22" title="Contact Us">
          <p className="text-slate-600 mb-4">
            If you have any questions or concerns about these Terms, please
            contact us:
          </p>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2 text-slate-600">
            <p>
              <span className="text-slate-900 font-medium">Operated by:</span>{" "}
              Shimle Ale Sardar (Partnership Firm), trading as RentalPins
            </p>
            <p>
              <span className="text-slate-900 font-medium">Email:</span>{" "}
              <a
                href="mailto:support@rentalpins.com"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                support@rentalpins.com
              </a>
            </p>
            <p>
              <span className="text-slate-900 font-medium">Phone:</span>{" "}
              <a
                href="tel:+919915209240"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                +91-9915209240
              </a>
            </p>
            <p>
              <span className="text-slate-900 font-medium">Website:</span>{" "}
              <a
                href="https://www.rentalpins.com"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                www.rentalpins.com
              </a>
            </p>
            <p>
              <span className="text-slate-900 font-medium">Address:</span> [Ludhiana 141205]
            </p>
          </div>
        </Section>
      </div>
    </MarketingShell>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-[#1E3A6E] font-serif pb-3 mb-4 border-b border-slate-200">
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}