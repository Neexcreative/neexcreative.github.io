/* SOLICITOR REVIEW REQUIRED: draft Privacy Notice for Small Forever. Not legal advice. */
import type { Metadata } from "next";
import Link from "next/link";
import { sfBusiness, sfDeletionDays, sfLegalPaths, sfLegalVersions } from "@/lib/sf-legal";
import LegalPage from "../_components/LegalPage";
import Todo from "../_components/Todo";

export const metadata: Metadata = {
  title: { absolute: "Privacy Notice · Small Forever" },
  description: "How Neex Creative handles your family's photos, videos, voice recordings and order details for Small Forever.",
  alternates: { canonical: sfLegalPaths.privacy },
  robots: { index: false, follow: true },
};

export default function SmallForeverPrivacyPage() {
  return (
    <LegalPage
      title="Privacy Notice"
      version={sfLegalVersions.privacy}
      intro={
        <p>
          Small Forever means trusting us with your family&apos;s most personal moments. This notice explains, in plain
          language, what we collect, why, who else is involved, how long we keep it and what your rights are. It covers
          Small Forever orders and gift vouchers. The rest of our website is covered by our{" "}
          <Link href="/privacy">general privacy notice</Link>.
        </p>
      }
    >
      <h2>Who is responsible for your data</h2>
      <p>
        {sfBusiness.owner}, trading as {sfBusiness.tradingName} (business name no. {sfBusiness.businessNameNumber}),{" "}
        {sfBusiness.address.join(", ")}. We are the &ldquo;controller&rdquo; of your personal data. For anything about
        your data, email <a href={`mailto:${sfBusiness.email}`}>{sfBusiness.email}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your order details:</strong> your name, email, delivery address, phone number if you give it, the plan
          you chose, whether it is a gift, and any referral code you enter or that came with the link you used
          (for example an Instagram creator&apos;s code), so we can pay them their commission. Payments are handled by Stripe; we see the payment status and the last four
          digits of the card, never the full card number.
        </li>
        <li>
          <strong>What you send us to make your Small Forever:</strong> photos, videos, voice recordings and letters, and
          your child&apos;s name and date of birth (so we can show their age on each moment).
        </li>
        <li>
          <strong>If you redeem a gift voucher:</strong> the voucher code and your email confirming that you accept our
          Terms and that you are the child&apos;s parent or legal guardian (or have their permission). We keep that email
          as our record.
        </li>
        <li>
          <strong>Messages</strong> you send us by email or WhatsApp.
        </li>
        <li>
          <strong>Website data:</strong> only with your consent, analytics and advertising cookies. See the general{" "}
          <Link href="/privacy">privacy notice</Link> and Cookie settings at the bottom of any page.
        </li>
      </ul>

      <h2>Whose data it is</h2>
      <p>
        Mostly your child&apos;s, as well as yours and that of anyone else who appears or speaks in the material (for
        example grandparents). When you send it, you confirm that you are the child&apos;s parent or legal guardian, or
        have their permission, and that the other people included are happy to be part of it.
      </p>

      <h2>Why we use it, and our legal basis</h2>
      <ul>
        <li>
          <strong>To make and deliver your Small Forever, and to answer you:</strong> this is needed to perform our
          contract with you (GDPR Article 6(1)(b)).
        </li>
        <li>
          <strong>To keep order and payment records</strong> required by Irish tax law: legal obligation (Article
          6(1)(c)).
        </li>
        <li>
          <strong>To keep our systems and your files secure and prevent fraud:</strong> our legitimate interests (Article
          6(1)(f)).
        </li>
        <li>
          <strong>Analytics and advertising cookies:</strong> only with your consent, which you can withdraw at any time.
        </li>
      </ul>
      <p>
        We look at your photos and videos only to build your timeline. We don&apos;t use facial recognition, we don&apos;t
        profile you or your child, and no decision about you is made automatically.
      </p>

      <h2>Your child&apos;s data: our promises</h2>
      <ul>
        <li>Only the person building your Small Forever ({sfBusiness.owner}) opens your files.</li>
        <li>
          We never use your material, or your child&apos;s image, name or voice, in our portfolio, on social media, in
          advertising or to train any AI system, unless you give us separate written permission for that specific use.
        </li>
        <li>We don&apos;t sell or share your data with anyone for their own marketing.</li>
      </ul>

      <h2>Who else is involved (our processors)</h2>
      <p>We use a small number of providers who process data on our behalf:</p>
      <ul>
        <li>
          <strong>Google (Google Drive)</strong>, to receive your files through a private upload link that only you get.{" "}
          <Todo>confirm Google Workspace account and its data processing terms are in place</Todo>
        </li>
        <li>
          <strong>Stripe</strong>, to take payments.
        </li>
        <li>
          <strong>Vercel</strong>, which hosts our website.
        </li>
        <li>
          <strong>Email provider</strong> for our messages to you. <Todo>name the email provider, e.g. Google Workspace or Gmail</Todo>
        </li>
        <li>
          <strong>Courier</strong>, who receives your name, address and phone to deliver the box.{" "}
          <Todo>name the courier</Todo>
        </li>
        <li>
          <strong>Google Analytics, Google Ads and the Meta Pixel</strong> (Facebook and Instagram ads), only if you
          accept those cookies. They receive anonymous events such as &ldquo;plans viewed&rdquo; or &ldquo;order
          completed&rdquo; with the plan and price, never your name, email or anything about your child.
        </li>
        <li>
          <strong>WhatsApp (Meta)</strong>, only if you choose to contact us there.
        </li>
      </ul>

      <h2>International transfers</h2>
      <p>
        Some of these providers are based in, or use services in, the United States. Where data leaves the European
        Economic Area, it is protected by the EU-US Data Privacy Framework or by the European Commission&apos;s Standard
        Contractual Clauses. <Todo>verify the transfer basis for each provider; SOLICITOR REVIEW REQUIRED</Todo>
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>
          <strong>Your photos, videos, voice recordings and letters:</strong> we keep our working copy only while we build
          your Small Forever. We delete it, including from the upload folder, <strong>{sfDeletionDays} days after
          delivery</strong>, which gives you time to check that everything is right. We record the date of each deletion.
          After that, the only copies are the ones you hold.
        </li>
        <li>
          <strong>Order, payment and voucher records:</strong> 6 years, as required by Irish tax law.{" "}
          <Todo>confirm the retention period with your accountant</Todo>
        </li>
        <li>
          <strong>Emails and messages:</strong> <Todo>how long, e.g. 2 years after the order</Todo>
        </li>
      </ul>

      <h2>How we protect it</h2>
      <ul>
        <li>A separate private upload folder for each family, never a public link.</li>
        <li>Our accounts are protected with two-step verification.</li>
        <li>
          Your delivered Small Forever opens with a family password.{" "}
          <Todo>confirm: work computer disk encrypted and password protected</Todo>
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask us to give you a copy of your data (access), correct it, delete it, restrict or object to how we use
        it, or receive it in a portable format. Email <a href={`mailto:${sfBusiness.email}`}>{sfBusiness.email}</a>. We
        reply within one month. If you ask us to delete your material before your Small Forever is finished, we&apos;ll
        explain whether we can still complete your order.
      </p>
      <p>
        If you&apos;re not happy with how we handle your data, you can complain to the Data Protection Commission at{" "}
        <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">dataprotection.ie</a>.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this notice in a way that matters, we&apos;ll update the version number at the top and tell customers
        with open orders.
      </p>
    </LegalPage>
  );
}
