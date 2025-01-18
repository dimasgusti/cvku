"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    transaction_id: string;
    link: string;
  };
}

export default function Billing() {
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<PaymentResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openPaymentLink = () => {
    if (!paymentLink?.data.link) {
      toast.error("Payment page is not generated.");
      return;
    }
    setDialogOpen(true);
  };

  const handleUpgrade = async () => {
    setBtnLoading(true);

    if (!session?.user?.name || !session.user.email) {
      toast.error("Error");
      return;
    }

    try {
      const response = await fetch(`/api/payment/createPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 19999,
          customerName: session.user?.name,
          email: session.user.email,
          mobile: "0000000000",
          description: `${session.user.email} CVKU Pro Plan`,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (response.ok) {
        setPaymentLink(data);
        openPaymentLink();
      } else {
        toast.error("Payment creation failed.");
        throw new Error("Payment creation failed.");
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  {dialogOpen && (
    toast(paymentLink?.data.link)
  )}

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <>
      <div className="flex flex-row justify-center items-center">
        <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
          <h2 className="text-xl md:text-2xl">Subscription</h2>
          <div className="flex flex-row justify-center items-center">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>You&apos;re on CVKU Free Plan</CardTitle>
                <CardDescription>
                  No Expiry, Enjoy for as Long as You Want.
                </CardDescription>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent>
                <Button
                  onClick={handleUpgrade}
                  disabled={btnLoading}
                  className="mb-2 w-full flex flex-row justify-center items-center"
                >
                  {" "}
                  {btnLoading ? "Processing..." : "Upgrade to CVKU Pro"}
                </Button>
                <CardDescription className="text-center text-xs">
                  Only Rp 19.999/month for premium features
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
