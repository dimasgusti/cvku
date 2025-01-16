"use client";

// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// type PaymentStatusResponse = {
//   success: boolean;
//   status?: string;
//   error?: string;
// };

export default function Payment() {
  // const { data: session } = useSession();
  // const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [isUpdated, setIsUpdated] = useState<boolean>(false);

  // const fetchPaymentStatus = async () => {
  //   if (session?.user?.email) {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         `/api/payment/checkPaymentStatus?email=${session.user?.email}`
  //       );
  //       const data: PaymentStatusResponse = await response.json();

  //       if (data.success) {
  //         setPaymentStatus(data.status || "Payment found, but no status provided.");

  //         if (data.status?.includes("paid") && !isUpdated) {
  //           console.log("Paid!")
  //         }
  //       } else {
  //         setPaymentStatus(data.error || "Transaction not found for this email.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching payment status:", error);
  //       setPaymentStatus("An error occurred while fetching payment status.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchPaymentStatus();
  // }, [session?.user?.email]);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <Link href="/profile">
          <Button variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <h2 className="text-xl md:text-2xl">Billing Information</h2>
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold">
            You are not currently subscribed to any package.
          </h3>
          <p className="mt-2 text-gray-600">
            Choose one of the following plans to continue using our services:
          </p>

          <div className="mt-4 space-y-3">
            {/* Free Plan */}
            <div className="p-4 border border-gray-200 rounded-md">
              <h4 className="font-semibold text-lg">Free Plan</h4>
              <p className="text-gray-600">
                A basic plan with limited features. Ideal for testing out the
                platform.
              </p>
              <p className="mt-2 font-semibold">Price: Free</p>
              <Link href="/subscribe/free">
                <Button className="mt-3 w-full">
                  Choose Free Plan
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-4 border border-gray-200 rounded-md">
              <h4 className="font-semibold text-lg">Pro Plan</h4>
              <p className="text-gray-600">
                Get access to all premium features including exclusive templates
                and more.
              </p>
              <p className="mt-2 font-semibold">Price: Rp 1.500.000 / year</p>
              <Link href="/subscribe/pro">
                <Button className="mt-3 w-full">
                  Choose Pro Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
