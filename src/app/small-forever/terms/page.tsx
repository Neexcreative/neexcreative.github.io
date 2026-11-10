/* SOLICITOR REVIEW REQUIRED: draft Terms of Sale for Small Forever. Not legal advice. */
import type { Metadata } from "next";
import Link from "next/link";
import { sfExtras, sfPlans } from "@/lib/small-forever";
import {
  sfBusiness,
  sfDeletionDays,
  sfLegalPaths,
  sfLegalVersions,
  sfVoucherYears,
} from "@/lib/sf-legal";
import LegalPage from "../_components/LegalPage";
import Todo from "../_components/Todo";

export const metadata: Metadata = {
  title: { absolute: "Terms of Sale · Small Forever" },
  description: "The terms that apply when you buy a Small Forever plan or gift voucher from Neex Creative.",
  alternates: { canonical: sfLegalPaths.terms },
  // Draft: kept out of search results until reviewed.
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Sale"
      version={sfLegalVersions.terms}
      intro={
        <p>
          These terms apply when you buy Small Forever, either as an order for your own family or as a gift voucher. They
          sit alongside our <Link href={sfLegalPaths.privacy}>Privacy Notice</Link> and our{" "}
          <Link href={sfLegalPaths.cancellation}>Cancellation page</Link>. Nothing in these terms affects your statutory
          rights as a consumer under Irish law.
        </p>
      }
    >
      <h2>1. Who we are</h2>
      <p>
        Small Forever is made by <strong>{sfBusiness.tradingName}</strong>, a business name registered with the Companies
        Registration Office (no. {sfBusiness.businessNameNumber}) by <strong>{sfBusiness.owner}</strong>, a sole trader.
      </p>
      <p>
        Address: {sfBusiness.address.join(", ")}. Email: <a href={`mailto:${sfBusiness.email}`}>{sfBusiness.email}</a>.
      </p>
      <p>
        Neex Creative is not registered for VAT. Our prices are final and no VAT is charged.
      </p>

      <h2>2. What you are buying</h2>
      <p>
        Small Forever is a private, offline timeline of your child&apos;s photos, videos, voice recordings and letters,
        made by us from the material you send, and delivered in a gift box on a keepsake drive. The plans are:
      </p>
      <ul>
        {sfPlans.map((plan) => (
          <li key={plan.key}>
            <strong>
              {plan.name}, €{plan.price}:
            </strong>{" "}
            {plan.features.join("; ")}.
          </li>
        ))}
      </ul>
      <p>
        Every plan also includes a printed letter sealed with wax, a 3-2-1 backup guide and free delivery in Ireland.
        Optional extras: {sfExtras.map((e) => `${e.name} (€${e.price})`).join(", ")}.
      </p>

      <h2>3. Prices and payment</h2>
      <p>
        Prices are in euro and include the drive, the gift box and delivery in Ireland. You pay in full when you order,
        through Stripe&apos;s secure checkout. We never see or store your full card details.
      </p>

      <h2>4. Two ways to buy</h2>
      <ul>
        <li>
          <strong>Order for my family.</strong> You buy Small Forever for your own child and send us your material.
        </li>
        <li>
          <strong>Gift voucher.</strong> You buy a voucher for someone else. They redeem it and send their material when
          they&apos;re ready.
        </li>
      </ul>
      <h3>Christmas 2026</h3>
      <p>
        For delivery in Ireland before Christmas, we need your order <strong>and</strong> all your photos, videos and
        voice notes by <strong>1 December 2026</strong> for Legacy, or <strong>4 December 2026</strong> for Little and
        Story. Gift vouchers can be bought until 24 December 2026; Small Forevers redeemed from Christmas vouchers are
        made from January 2027. Delivery dates depend on the courier and are not guaranteed.{" "}
        <Todo>confirm these cut-offs and the courier used</Todo>
      </p>

      <h2>5. Gift vouchers</h2>
      <ul>
        <li>
          A voucher is valid for <strong>{sfVoucherYears} years</strong> from the date of purchase. The expiry date is
          printed on the voucher. No fees are charged for holding or using it.
        </li>
        <li>
          It can be used for the plan it was bought for. To redeem it, the recipient emails us the voucher code at{" "}
          <a href={`mailto:${sfBusiness.email}`}>{sfBusiness.email}</a>.
        </li>
        <li>
          The person who redeems the voucher and sends the material (the child&apos;s parent or legal guardian) must
          accept these Terms and read our Privacy Notice at that point, even if someone else paid.
        </li>
        <li>
          You can cancel a voucher within 14 days of buying it, as explained on our{" "}
          <Link href={sfLegalPaths.cancellation}>Cancellation page</Link>.
        </li>
        <li>
          If a voucher expires unused, <Todo>what happens at expiry, e.g. no refund or credit; SOLICITOR REVIEW REQUIRED</Todo>
        </li>
      </ul>

      <h2>6. What we need from you</h2>
      <ul>
        <li>
          Send your material through the private upload link we email you, by the agreed date (or the Christmas cut-off).
          If it arrives late, we&apos;ll make your Small Forever as soon as we can, but we can&apos;t promise a delivery
          date.
        </li>
        <li>
          You confirm that you are the child&apos;s parent or legal guardian, or have their permission, and that you have
          the right to share the material with us.
        </li>
        <li>
          You confirm that other people who appear or speak in the material (for example grandparents recording a
          message) are happy for it to be included.
        </li>
        <li>Please don&apos;t send material that is unlawful or that you don&apos;t have the right to share.</li>
      </ul>

      <h2>7. How we make it</h2>
      <p>
        We start building once we have all your material. We send you a preview to approve before we prepare the drive.{" "}
        <Todo>usual production time, e.g. X working days after all material arrives</Todo>{" "}
        <Todo>how many rounds of changes are included in the price</Todo>
      </p>

      <h2>8. Delivery</h2>
      <p>
        We deliver free of charge to addresses in Ireland only. <Todo>courier name and usual delivery time</Todo> The
        drive is your responsibility once it has been delivered.
      </p>

      <h2>9. Keeping your copies safe</h2>
      <p>
        Any drive can fail, be lost or be damaged, so please don&apos;t rely on a single copy. Every box includes a 3-2-1
        backup guide: three copies, in two places, one of them outside your home. Keeping those copies is your
        responsibility.
      </p>
      <p>
        We delete our working copy of your files <strong>{sfDeletionDays} days after delivery</strong> (see our{" "}
        <Link href={sfLegalPaths.privacy}>Privacy Notice</Link>). After that, we can&apos;t recreate your Small Forever
        from our side.
      </p>

      <h2>10. Legacy and the 500 GB drive</h2>
      <p>
        Legacy has no limit on how many photos, videos or voice notes you send, and is delivered on a 500 GB SSD. We
        prepare videos in Full HD. If your material would still go over 500 GB, we tell you before we start building and
        you choose: we help you select the moments that matter most, or we move you to a larger drive and charge only the
        difference in the drive&apos;s cost. We never leave anything out without asking.
      </p>

      <h2>11. If something is wrong</h2>
      <p>
        Your Small Forever must be as described, of satisfactory quality and fit for purpose. If the drive is faulty or
        the timeline doesn&apos;t work as described, tell us and we&apos;ll put it right. You have legal rights to a
        repair, replacement, price reduction or refund under the Consumer Rights Act 2022. These terms don&apos;t limit
        those rights.
      </p>

      <h2>12. Cancelling</h2>
      <p>
        Your right to cancel depends on what you bought. Please read our{" "}
        <Link href={sfLegalPaths.cancellation}>Cancellation page</Link>. In short: a gift voucher can be cancelled within
        14 days; a Small Forever made for your family is personalised and made to order, so the 14-day right to cancel
        does not apply to it, and we ask you to confirm that before you pay.
      </p>

      <h2>13. Your material and our work</h2>
      <ul>
        <li>You keep all rights to your photos, videos, voice recordings and letters.</li>
        <li>
          You give us a limited permission to use them only to make, check and deliver your Small Forever. It ends when we
          delete our working copy.
        </li>
        <li>
          The design and software of the Small Forever timeline belong to Neex Creative. You may use, copy and share your
          own Small Forever privately, for your family.
        </li>
        <li>
          We will never use your material or your child&apos;s image or voice in our portfolio, social media or
          advertising unless you give us separate written permission.
        </li>
      </ul>

      <h2>14. Our responsibility to you</h2>
      <p>
        If we break these terms, we are responsible for loss or damage you suffer that is a foreseeable result of that.
        We are not responsible for loss that was not foreseeable. Nothing in these terms limits our liability for death
        or personal injury caused by our negligence, for fraud, or for anything else that cannot be limited under Irish
        law, and nothing limits your statutory rights.
      </p>

      <h2>15. Events outside our control</h2>
      <p>
        If something outside our reasonable control (for example a courier or postal disruption, a supplier failing, or
        illness) delays your order, we&apos;ll tell you as soon as we can and do our best to limit the delay. If the
        delay is long, you can contact us to cancel and receive a refund for anything we haven&apos;t delivered.
      </p>

      <h2>16. Complaints</h2>
      <p>
        If you&apos;re unhappy, email <a href={`mailto:${sfBusiness.email}`}>{sfBusiness.email}</a>.{" "}
        <Todo>how fast you reply, e.g. within 5 working days</Todo> We are not currently a member of an alternative
        dispute resolution scheme. <Todo>confirm; SOLICITOR REVIEW REQUIRED</Todo> Information about your consumer rights
        is available from the Competition and Consumer Protection Commission at{" "}
        <a href="https://www.ccpc.ie" target="_blank" rel="noopener noreferrer">ccpc.ie</a>.
      </p>

      <h2>17. Law</h2>
      <p>
        These terms are governed by Irish law, and the Irish courts can hear any dispute. If you live elsewhere in the EU,
        you also keep the protection of the mandatory consumer laws of your country.
      </p>

      <h2>18. Changes to these terms</h2>
      <p>
        We may update these terms. The version you accepted when you ordered (shown at the top of this page as the
        version number) is the one that applies to your order, and we keep a record of it.
      </p>
    </LegalPage>
  );
}
