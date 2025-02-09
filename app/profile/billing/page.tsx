"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TransactionData {
  id: string;
  transactionId: string;
  status: string;
  transactionStatus: string;
  createdAt: string;
  updatedAt: string;
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  amount: number;
  isAdminFeeBorneByCustomer: boolean;
  isChannelFeeBorneByCustomer: boolean;
  productId: string;
  productName: string;
  productType: string;
  pixelFbp: string | null;
  pixelFbc: string | null;
  couponUsed: string | null;
  paymentMethod: string;
  nettAmount: number;
  endDate: number;
}

interface TransactionResponse {
  success: boolean;
  transactions: Array<{
    _id: string;
    event: string;
    data: TransactionData;
  }>;
  isActive: boolean;
}

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
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] =
    useState<TransactionResponse | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<PaymentResponse | null>(null);

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
          amount: 1000,
          customerName: session.user?.name,
          email: session.user.email,
          mobile: "0000000000",
          description: `${session.user.email} CVKU Pro Plan`,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (response.ok) {
        setPaymentLink(data);
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

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/transaction/checkSubscription?email=${session.user.email}`
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          setTransactionData(data);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.email) {
      fetchTransactionData();
    }
  }, [session?.user?.email]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  const latestTransaction = transactionData?.transactions[0]?.data;

  return (
    <div className="flex flex-col justify-center items-center space-y-6 w-full max-w-2xl mx-auto px-4">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <div className="space-y-4 pt-4 pb-16">
          <Link href="/profile">
            <Button variant="outline" className="w-full">
              <ArrowLeft />
              Back to Profile
            </Button>
          </Link>
          <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Your Subscription Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  Current Plan:{" "}
                  <span className="font-semibold text-green-600">
                    {transactionData?.isActive ? "CVKU Pro" : "CVKU Free"}
                  </span>
                </p>
                {transactionData?.isActive ? (
                  latestTransaction ? (
                    <>
                      <p>
                        <strong>Payment Date:</strong>{" "}
                        {new Date(
                          latestTransaction.createdAt
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Amount:</strong> Rp {latestTransaction.amount}
                      </p>
                      <p>
                        <strong>Ends on:</strong>{" "}
                        {new Date(latestTransaction.endDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {latestTransaction.paymentMethod}
                      </p>
                    </>
                  ) : (
                    <p>No transaction history found.</p>
                  )
                ) : (
                  <div className="mt-6">
                    <Button
                      onClick={handleUpgrade}
                      disabled={btnLoading || !!paymentLink}
                      className="w-full"
                    >
                      {paymentLink
                        ? "Payment Link Ready"
                        : btnLoading
                        ? "Processing..."
                        : "Upgrade to CVKU Pro"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Pay via QRIS or Bank Virtual Account (Indonesia).
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Only Rp 54.999/year for premium features.
                    </p>
                    {paymentLink && (
                      <div className="mt-4">
                        <CardTitle className="text-lg font-semibold">
                          Your Payment Link:
                        </CardTitle>
                        <Link href={paymentLink.data.link} target="_blank">
                          <Button variant="secondary" className="w-full">
                            {paymentLink.data.link}
                            <ExternalLink size={14} className="ml-2" />
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-500 mt-2">
                          Please refresh after completing payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
