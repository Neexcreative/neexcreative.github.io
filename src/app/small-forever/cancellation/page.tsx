/* SOLICITOR REVIEW REQUIRED: draft cancellation information for Small Forever. Not legal advice. */
import type { Metadata } from "next";
import Link from "next/link";
import { sfBusiness, sfLegalPaths, sfLegalVersions } from "@/lib/sf-legal";
import LegalPage from "../_components/LegalPage";
import Todo from "../_components/Todo";

export const metadata: Metadata = {
  title: { absolute: "Cancellation · Small Forever" },
  description: "Your right to cancel a Small Forever order or gift voucher, and how to do it.",
  alternates: { canonical: sfLegalPaths.cancellation },
  robots: { index: false, follow: true },
};

export default function CancellationPage() {
  return (
    <LegalPage
      title="Cancellation"
      version={sfLegalVersions.cancellation}
      intro={
        <p>
          When you buy online you usually have 14 days to change your mind. How that works for Small Forever depends on
          what you bought. This page explains it simply. Your rights if something is faulty are separate and are not
          affected (see our <Link href={sfLegalPaths.terms}>Terms of Sale</Link>).
        </p>
      }
    >
      <h2>Gift vouchers: 14 days to cancel</h2>
      <p>
        You can cancel a gift voucher for any reason within <strong>14 days of the day you bought it</strong>, as long as
        it hasn&apos;t been redeemed. We refund the full amount within 14 days of hearing from you, to the card you paid
        with, at no cost to you. <Todo>position on a voucher that is redeemed within the 14 days; SOLICITOR REVIEW REQUIRED</Todo>
      </p>

      <h2>Small Forever for your family: made to order</h2>
      <p>
        A Small Forever ordered for your family is made to order and clearly personalised: we build it from your own
        photos, videos and voice recordings, with your child&apos;s name, ages and letters. Under the Consumer Rights Act
        2022, the 14-day right to cancel <strong>does not apply</strong> to goods made to the consumer&apos;s
        specifications or clearly personalised.
      </p>
      <p>
        We tell you this before you buy, and at checkout we ask you to tick a box to confirm you understand it. You
        can&apos;t pay without ticking it.
      </p>
      <p>
        <strong>Before we start building:</strong> if you change your mind before you&apos;ve sent us any material, email
        us and we&apos;ll cancel and refund in full. <Todo>confirm you want to offer this; SOLICITOR REVIEW REQUIRED on how
        the personalisation exception and the service part of the order interact</Todo>
      </p>

      <h2>How to cancel</h2>
      <p>
        Email <a href={`mailto:${sfBusiness.email}?subject=Small%20Forever%20cancellation`}>{sfBusiness.email}</a> with
        your name, the email you used to order and, if you have it, your order or voucher code. A clear statement is
        enough; you can also use the model form below, but you don&apos;t have to. We&apos;ll confirm by email.
      </p>
      <p>
        Postal address: {sfBusiness.owner}, {sfBusiness.tradingName}, {sfBusiness.address.join(", ")}.
      </p>

      <h2>Refunds</h2>
      <ul>
        <li>We refund within 14 days of receiving your cancellation.</li>
        <li>We use the same payment method you used, and we don&apos;t charge any fee for the refund.</li>
        <li>
          Nothing physical needs to be returned for a gift voucher. <Todo>if a drive has already been posted, who pays the
          return</Todo>
        </li>
      </ul>

      <h2>Model cancellation form</h2>
      <p>Complete and return this form only if you wish to cancel. It is optional.</p>
      <div className="mt-4 rounded-2xl border border-[#e8d9cf] bg-white p-6 text-[15px] leading-relaxed text-[#3b2a24]">
        <p className="!mt-0">
          To: {sfBusiness.owner}, {sfBusiness.tradingName}, {sfBusiness.address.join(", ")}, {sfBusiness.email}
        </p>
        <p>
          I/We (*) hereby give notice that I/We (*) cancel my/our (*) contract of sale of the following goods (*) / for
          the supply of the following service (*):
        </p>
        <p>Ordered on (*) / received on (*):</p>
        <p>Name of consumer(s):</p>
        <p>Address of consumer(s):</p>
        <p>Signature of consumer(s) (only if this form is sent on paper):</p>
        <p>Date:</p>
        <p className="text-sm">(*) Delete as appropriate.</p>
      </div>
      <p className="text-sm">
        <Todo>check this wording against the model form in the Consumer Rights Act 2022; SOLICITOR REVIEW REQUIRED</Todo>
      </p>
    </LegalPage>
  );
}
