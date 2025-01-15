"use client";

import { Button } from "@/components/ui/button";
import { fetchData } from "@/utils/api";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Payment {
  success: boolean;
  status: string;
}

export default function Payment() {
  const { data: session } = useSession();
  const [paymentData, setPaymentData] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      if (session?.user?.email) {
        try {
          const paymentData = await fetchData(
            `/api/users/getUserByEmail?email=${session.user.email}`
          );
          setPaymentData(paymentData);
        } catch (error) {
          console.error(`Error fetching payment:`, error);
        }
      }
    };
    fetchPayment();
  }, [session]);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <Link href="/profile">
          <Button variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <h2 className="text-xl md:text-2xl">Payment Information</h2>

        {/* Display payment status */}
        {paymentData ? (
          <div className="">
            <p className="">{paymentData.status}</p>
          </div>
        ) : (
          <p className="">
            No payment information available.
          </p>
        )}
      </div>
    </div>
  );
}
