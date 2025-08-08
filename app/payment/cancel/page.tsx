import { Suspense } from "react";
import PaymentCancelPage from "@/components/PaymentCancelPage";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <PaymentCancelPage />
    </Suspense>
  );
}
