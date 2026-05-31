import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "RentalPins privacy policy — data collection, usage, storage and user rights for renters and listers on our marketplace.",
  keywords: ["RentalPins privacy", "data policy rentals India"],
  alternates: {
    canonical: canonicalUrl("/privacy-policy"),
  },
  openGraph: {
    title: "Privacy Policy | RentalPins",
    description: "How RentalPins handles personal data and privacy.",
    url: canonicalUrl("/privacy-policy"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy | RentalPins",
    description: "RentalPins privacy policy.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <MarketingShell>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-10">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1E3A6E] font-serif">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last Updated: May 10, 2026</p>

        <div className="mt-10 space-y-4 text-slate-600 leading-relaxed">
          <p>
            <span className="text-[#1E3A6E] font-semibold">Shimle Ale Sardar</span>{" "}
            (a registered Partnership Firm), operating under the brand name{" "}
            <span className="text-[#1E3A6E] font-semibold">RentalPins</span>{" "}
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), is committed to
            protecting the privacy of individuals who use our website at{" "}
            <a
              href="https://www.rentalpins.com"
              className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
            >
              www.rentalpins.com
            </a>{" "}
            and the RentalPins mobile application (collectively, the
            &quot;Platform&quot;). This Privacy Policy describes how we collect,
            use, store, share, and protect your personal information when you
            access or use our services.
          </p>
          <p>
            By accessing or using the Platform, you agree to the terms of this
            Privacy Policy. If you do not agree, please discontinue use of the
            Platform immediately.
          </p>
        </div>

        {/* Section 1 */}
        <Section number="1" title="Information We Collect">
          <h3 className="text-lg font-semibold text-[#1E3A6E] mt-6 mb-3">
            1.1 Information You Provide Directly
          </h3>
          <p className="text-slate-600 mb-3">
            When you register, create a listing, make a booking, or interact
            with the Platform, we may collect:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">
                Account Information:
              </span>{" "}
              Full name, email address, mobile phone number, profile photo, and
              password.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Phone Number Verification:
              </span>{" "}
              During registration, we collect your mobile number and verify it
              using a One-Time Password (OTP) sent via SMS. This is mandatory
              for account creation and is used to authenticate your identity,
              prevent fraudulent sign-ups, and enable account recovery. Your
              verified mobile number may also be shared with the other party
              during an active rental transaction for coordination purposes.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Identity Verification:
              </span>{" "}
              Government-issued ID or address proof, when required for trust and
              safety.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Listing Information:
              </span>{" "}
              Property or item descriptions, photos, rental pricing,
              availability, and location details you provide when creating a
              listing.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Payment Information:
              </span>{" "}
              Billing name, billing address, and payment instrument details.
              Payments are processed securely through our payment partner,
              Razorpay. We do not store your full credit/debit card numbers or
              bank account details on our servers.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Communications:</span>{" "}
              Messages sent through our in-app messaging system, support
              requests, feedback, and reviews.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[#1E3A6E] mt-8 mb-3">
            1.2 Information Collected Automatically
          </h3>
          <p className="text-slate-600 mb-3">
            When you use the Platform, we automatically collect certain
            information, including:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">
                Device Information:
              </span>{" "}
              Device model, operating system, unique device identifiers, browser
              type, and app version.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Location Data:</span>{" "}
              With your permission, we collect precise GPS location data from
              your device to power core features of the Platform, including:
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500">
                <li>
                  Discovering nearby rental listings and services around you.
                </li>
                <li>
                  Displaying your approximate location to potential
                  renters/listers for relevant search results.
                </li>
                <li>
                  Pinning your listing to the correct location on the map.
                </li>
                <li>Providing distance-based search and sorting.</li>
              </ul>
              <p className="mt-2 text-slate-500">
                Location access can be managed through your device settings at
                any time. Disabling location permission will limit the
                functionality of location-based features such as nearby
                discovery. We may also collect approximate location from your IP
                address when GPS is not available.
              </p>
            </li>
            <li>
              <span className="text-slate-900 font-medium">Usage Data:</span> Pages
              visited, features used, search queries, interactions with listings,
              time spent on the Platform, and referring URLs.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Log Data:</span> IP
              address, access timestamps, error logs, and crash reports.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[#1E3A6E] mt-8 mb-3">
            1.3 Information from Third-Party Services
          </h3>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">
                SMS/OTP Verification:
              </span>{" "}
              We use third-party SMS gateway providers to deliver OTP codes to
              your mobile number for verification. Your phone number is shared
              with the SMS provider solely for the purpose of delivering the
              OTP. No additional personal data is shared.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Analytics Providers:
              </span>{" "}
              We use Google Analytics and Firebase Analytics to understand usage
              patterns and improve the Platform.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Push Notification Services:
              </span>{" "}
              Firebase Cloud Messaging (FCM) is used to deliver push
              notifications to your device.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Payment Partner:</span>{" "}
              Razorpay may share transaction confirmation details and payment
              status with us.
            </li>
          </ul>
        </Section>

        {/* Section 2 */}
        <Section number="2" title="How We Use Your Information">
          <p className="text-slate-600 mb-4">
            We use the collected information for the following purposes:
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="px-4 py-3 text-[#1E3A6E] font-semibold border-b border-slate-200 w-1/4">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-[#1E3A6E] font-semibold border-b border-slate-200">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Providing Services
                  </td>
                  <td className="px-4 py-3">
                    To create and manage your account, verify your mobile number
                    via OTP, facilitate rental transactions, enable
                    location-based discovery of nearby rentals, display listings
                    on the map, and process payments.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Communication
                  </td>
                  <td className="px-4 py-3">
                    To send OTP codes for phone verification, transactional
                    notifications (booking confirmations, payment receipts), push
                    notifications, and customer support responses.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Safety & Trust
                  </td>
                  <td className="px-4 py-3">
                    To verify user identities through OTP-based phone
                    verification, prevent fraudulent accounts, enforce our terms
                    of service, and maintain platform integrity.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Improvement & Analytics
                  </td>
                  <td className="px-4 py-3">
                    To analyze usage patterns, diagnose technical issues, improve
                    features, and enhance user experience.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Legal Compliance
                  </td>
                  <td className="px-4 py-3">
                    To comply with applicable laws, regulations, legal processes,
                    or governmental requests.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Section 3 */}
        <Section number="3" title="How We Share Your Information">
          <p className="text-slate-600 mb-3">
            We do not sell your personal data to third parties. We may share your
            information in the following circumstances:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">With Other Users:</span>{" "}
              When you create a listing or make a booking, certain information
              (such as your name, profile photo, and contact details) is shared
              with the other party to facilitate the rental transaction.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Service Providers:
              </span>{" "}
              We share data with trusted third-party providers who assist in
              operating the Platform, including Razorpay (payment processing),
              SMS gateway providers (OTP delivery for phone verification),
              Google/Firebase (analytics and push notifications), and cloud
              hosting providers. These providers are contractually obligated to
              protect your data and use it only for the services they provide to
              us.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Legal Requirements:
              </span>{" "}
              We may disclose information if required by law, regulation, court
              order, or governmental authority, or to protect the rights, safety,
              and property of RentalPins, our users, or the public.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Business Transfers:
              </span>{" "}
              In the event of a merger, acquisition, or sale of assets, your
              information may be transferred as part of the transaction. We will
              notify you of any such change.
            </li>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section number="4" title="Data Storage and Security">
          <p className="text-slate-600 mb-3">
            We implement industry-standard security measures to protect your
            personal information, including:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc pl-5">
            <li>Encryption of data in transit using SSL/TLS protocols.</li>
            <li>Secure storage of data on protected servers.</li>
            <li>
              Access controls limiting data access to authorized personnel only.
            </li>
            <li>Regular security assessments and monitoring.</li>
          </ul>
          <p className="text-slate-600 mt-4">
            While we take reasonable precautions, no method of electronic
            transmission or storage is 100% secure. We cannot guarantee absolute
            security of your data.
          </p>
          <p className="text-slate-600 mt-3">
            Your data is primarily stored on servers located in India. If you
            access the Platform from outside India, your data may be transferred
            to and processed in India.
          </p>
        </Section>

        {/* Section 5 */}
        <Section number="5" title="Data Retention">
          <p className="text-slate-600 mb-3">
            We retain your personal information for as long as your account is
            active or as needed to provide you with our services. Specifically:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">Account Data:</span>{" "}
              Retained for the duration of your account and for up to 3 years
              after account deletion, unless a longer retention period is
              required by law.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Transaction Records:
              </span>{" "}
              Retained for a minimum period as required under applicable tax and
              financial laws.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Usage and Analytics Data:
              </span>{" "}
              Retained in aggregated or anonymized form and may be kept
              indefinitely for analytical purposes.
            </li>
          </ul>
          <p className="text-slate-600 mt-4">
            You may request deletion of your account and associated data at any
            time (see Section 8).
          </p>
        </Section>

        {/* Section 6 */}
        <Section number="6" title="Cookies and Tracking Technologies">
          <p className="text-slate-600 mb-3">
            Our website uses cookies and similar tracking technologies to enhance
            your browsing experience. These include:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">
                Essential Cookies:
              </span>{" "}
              Required for the Platform to function correctly (e.g., session
              management, authentication).
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Analytics Cookies:
              </span>{" "}
              Used by Google Analytics and Firebase to collect anonymized usage
              statistics.
            </li>
          </ul>
          <p className="text-slate-600 mt-4">
            You can manage cookie preferences through your browser settings.
            Disabling certain cookies may affect Platform functionality.
          </p>
        </Section>

        {/* Section 7 */}
        <Section number="7" title="Android App Permissions">
          <p className="text-slate-600 mb-4">
            The RentalPins Android application requests the following device
            permissions to deliver its core functionality:
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="px-4 py-3 text-[#1E3A6E] font-semibold border-b border-slate-200 w-1/3">
                    Permission
                  </th>
                  <th className="px-4 py-3 text-[#1E3A6E] font-semibold border-b border-slate-200">
                    Why We Need It
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Location (Fine/Coarse)
                  </td>
                  <td className="px-4 py-3">
                    To discover nearby rentals, display listings on the map, and
                    allow you to pin your listing to the correct location.
                    Location is collected only when the app is in use
                    (foreground), unless you grant background access.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Camera
                  </td>
                  <td className="px-4 py-3">
                    To capture photos of rental items or properties for your
                    listings.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Storage / Media
                  </td>
                  <td className="px-4 py-3">
                    To upload photos from your gallery to listing pages.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Phone / SMS (Read OTP)
                  </td>
                  <td className="px-4 py-3">
                    To auto-read the OTP sent during phone number verification,
                    so you don&apos;t have to type it manually. This permission
                    is optional — you can always enter the OTP manually.
                  </td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Notifications
                  </td>
                  <td className="px-4 py-3">
                    To send you push notifications about booking updates,
                    messages, and important alerts.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[#1E3A6E] align-top">
                    Internet
                  </td>
                  <td className="px-4 py-3">
                    Required for all Platform functionality, including loading
                    listings, processing payments, and communicating with our
                    servers.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 mt-4">
            You can revoke any of these permissions at any time through your
            device&apos;s Settings &gt; Apps &gt; RentalPins &gt; Permissions.
            Revoking certain permissions may limit some features of the app.
          </p>
        </Section>

        {/* Section 8 */}
        <Section number="8" title="Your Rights and Choices">
          <p className="text-slate-600 mb-3">
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">Access:</span> Request a
              copy of the personal data we hold about you.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Correction:</span>{" "}
              Request correction of inaccurate or incomplete data.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Deletion:</span> Request
              deletion of your account and personal data, subject to legal
              retention requirements.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Withdraw Consent:
              </span>{" "}
              Withdraw consent for data processing activities (e.g., location
              tracking, push notifications) through your device settings or by
              contacting us.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Data Portability:
              </span>{" "}
              Request your data in a structured, machine-readable format where
              technically feasible.
            </li>
            <li>
              <span className="text-slate-900 font-medium">
                Opt-Out of Marketing:
              </span>{" "}
              Unsubscribe from promotional communications using the link in our
              emails or by contacting us.
            </li>
          </ul>
          <p className="text-slate-600 mt-4">
            To exercise any of these rights, please contact us at the details
            provided in Section 13.
          </p>
        </Section>

        {/* Section 9 */}
        <Section number="9" title="Third-Party Links and Services">
          <p className="text-slate-600">
            The Platform may contain links to third-party websites or services
            that are not operated by us. We are not responsible for the privacy
            practices of such third parties. We recommend reviewing their privacy
            policies before providing them with any personal information.
          </p>
        </Section>

        {/* Section 10 */}
        <Section number="10" title="Children's Privacy">
          <p className="text-slate-600">
            The Platform is not intended for individuals under the age of 18. We
            do not knowingly collect personal information from children. If we
            become aware that we have inadvertently collected data from a minor,
            we will take steps to delete such information promptly. If you
            believe a child has provided us with personal data, please contact us
            immediately.
          </p>
        </Section>

        {/* Section 11 */}
        <Section number="11" title="Changes to This Privacy Policy">
          <p className="text-slate-600">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technology, or legal requirements. When we
            make material changes, we will notify you by posting the updated
            policy on the Platform with a revised &quot;Last Updated&quot; date,
            and where appropriate, through in-app notifications or email.
          </p>
          <p className="text-slate-600 mt-3">
            We encourage you to review this page periodically. Your continued
            use of the Platform after changes are posted constitutes acceptance
            of the updated Privacy Policy.
          </p>
        </Section>

        {/* Section 12 — International & regional privacy */}
        <Section number="12" title="International users, transfers &amp; regional privacy (India, UK, Kenya &amp; Nigeria)">
          <p className="text-slate-600 mb-3">
            RentalPins is operated from{" "}
            <span className="text-slate-900 font-medium">India</span>, but Users may
            access the Platform from other countries. Depending on your location,
            additional privacy rules may apply alongside this Policy.
          </p>
          <ul className="space-y-3 text-slate-600 list-disc pl-5">
            <li>
              <span className="text-slate-900 font-medium">International transfers:</span>{" "}
              Your information may be processed on servers or by service providers
              located outside your country (including in India). Where required by
              applicable law, we use appropriate safeguards (such as contractual
              clauses recognised in your jurisdiction) for cross-border transfers.
            </li>
            <li>
              <span className="text-slate-900 font-medium">United Kingdom:</span> If
              UK GDPR / Data Protection Act 2018 applies to our processing, you may
              have rights including access, rectification, erasure, restriction,
              objection, portability, and the right to lodge a complaint with the
              ICO. Nothing in this Policy limits those rights where they are
              mandatory.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Kenya:</span> Where the Data
              Protection Act, 2019 applies, you may have rights to be informed of
              processing, to access and correct your data, to object in prescribed
              circumstances, and to lodge complaints with the Office of the Data
              Protection Commissioner.
            </li>
            <li>
              <span className="text-slate-900 font-medium">Nigeria:</span> Where the
              Nigeria Data Protection Act 2023 and NDPR-derived regulations apply,
              you may have similar access, correction, deletion and objection rights,
              and the ability to escalate concerns to the Nigeria Data Protection
              Commission.
            </li>
            <li>
              <span className="text-slate-900 font-medium">India:</span> Grievance and
              data-protection contact details remain as set out in Section 13 below.
            </li>
          </ul>
          <p className="text-slate-600 mt-4 text-sm">
            This Section is a general summary and is not legal advice. If you are
            unsure which laws apply to you, consult a qualified adviser.
          </p>
        </Section>

        {/* Section 13 */}
        <Section number="13" title="Grievance Officer">
          <p className="text-slate-600 mb-4">
            In accordance with the Information Technology Act, 2000, and the
            rules made thereunder, the details of the Grievance Officer are as
            follows:
          </p>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2 text-slate-600">
            <p>
              <span className="text-slate-900 font-medium">
                Grievance Officer:
              </span>{" "}
              [Name of Grievance Officer]
            </p>
            <p>
              <span className="text-slate-900 font-medium">Firm:</span> Shimle Ale
              Sardar (Partnership Firm), trading as RentalPins
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
              <span className="text-slate-900 font-medium">Address:</span> [Your
              Registered Business Address]
            </p>
            <p>
              <span className="text-slate-900 font-medium">Response Time:</span> We
              will acknowledge your grievance within 24 hours and aim to resolve
              it within 15 days of receipt.
            </p>
          </div>
        </Section>

        {/* Section 14 */}
        <Section number="14" title="Contact Us">
          <p className="text-slate-600 mb-4">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please reach out to us:
          </p>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2 text-slate-600">
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
              <span className="text-slate-900 font-medium">Website:</span>{" "}
              <a
                href="https://www.rentalpins.com"
                className="text-[#1E3A6E] hover:text-[#E8501A] underline underline-offset-2"
              >
                www.rentalpins.com
              </a>
            </p>
          </div>
        </Section>
      </div>
    </MarketingShell>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-[#1E3A6E] font-serif pb-3 mb-4 border-b border-slate-200">
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}