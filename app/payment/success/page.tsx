import { Suspense } from "react";
import PaymentSuccessPage from "@/components/PaymentSuccessPage"; // move logic here

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Verifying payment...</p>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
