import type { Metadata } from "next";
import { sfLegalPaths, sfLegalVersions } from "@/lib/sf-legal";
import LegalPage from "../_components/LegalPage";
import RedeemForm from "./RedeemForm";

export const metadata: Metadata = {
  title: { absolute: "Redeem your gift voucher · Small Forever" },
  description: "Redeem a Small Forever gift voucher and receive your private upload link.",
  alternates: { canonical: "/small-forever/redeem" },
  robots: { index: false, follow: false },
};

export default function RedeemPage() {
  return (
    <LegalPage
      title="Redeem your gift voucher"
      version={sfLegalVersions.terms}
      intro={
        <p>
          Someone gave you Small Forever. Before you send us any photos, videos or voice notes, please confirm two things
          below. Then we&apos;ll email you a private link to upload them. Read the{" "}
          <a href={sfLegalPaths.terms}>Terms of Sale</a> and the <a href={sfLegalPaths.privacy}>Privacy Notice</a>{" "}
          first.
        </p>
      }
    >
      <div className="mt-8">
        <RedeemForm />
      </div>
    </LegalPage>
  );
}
