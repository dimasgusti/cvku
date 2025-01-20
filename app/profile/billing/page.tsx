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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ExternalLink, Loader } from "lucide-react";

interface PaymentResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    transaction_id: string;
    link: string;
  };
}

interface Transaction {
  event: string;
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  customerEmail: string;
  customerMobile: string;
  amount: string;
  isAdminFeeBorneByCustomer: string;
  isChannelFeeBorneByCustomer: string;
  productId: string;
  productName: string;
  productType: string;
  endDate: string;
}

export default function Billing() {
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<PaymentResponse | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/transaction/getTransactionByEmail?email=${session?.user?.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch payment status.");
        }
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    if (session?.user?.email) {
      fetchPaymentStatus();
    }
  }, [session?.user?.email]);

  const isProPlanActive = transactions.some((transaction) => {
    const today = new Date();
    const endDate = new Date(transaction.endDate);
    return endDate >= today;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] px-4 space-y-4 py-4">
          <h2 className="text-xl md:text-2xl">Subscription</h2>
          <div className="flex flex-row justify-center items-center">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  {isProPlanActive
                    ? "You're on CVKU Pro Plan"
                    : "You're on CVKU Free Plan"}
                </CardTitle>
                <CardDescription>
                  {isProPlanActive
                    ? "Enjoy premium features until your subscription ends."
                    : "No Expiry, Enjoy for as Long as You Want."}
                </CardDescription>
              </CardHeader>
              {!isProPlanActive && <Separator className="mb-4" />}
              <CardContent>
                <div className="flex flex-col justify-center items-center gap-2 mb-2">
                  {paymentLink && (
                    <>
                      <CardTitle>You&apos;re payment link:</CardTitle>
                      <Link href={paymentLink.data.link} target="_blank">
                        <Button variant="secondary" className="mb-2">
                          {paymentLink.data.link}
                          <ExternalLink size={14} />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
                {!isProPlanActive && (
                  <Button
                    onClick={handleUpgrade}
                    disabled={btnLoading}
                    className="mb-2 w-full flex flex-row justify-center items-center"
                  >
                    {btnLoading ? "Processing..." : "Upgrade to CVKU Pro"}
                  </Button>
                )}
                <CardDescription className="text-center text-xs">
                  {!isProPlanActive &&
                    "Only Rp 19.999/month for premium features"}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <h2 className="text-xl md:text-2xl">History</h2>
        </div>
        <div className="w-full flex flex-row justify-center items-center">
          <Card className="w-fit mx-4">
            <CardContent className="py-4">
              <table>
                <thead>
                  <tr>
                    <th className="border px-4 py-2">No</th>
                    <th className="border px-4 py-2">Start Date</th>
                    <th className="border px-4 py-2">End Date</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Payment Method</th>
                    <th className="border px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(transaction.createdAt))}
                        </td>
                        <td className="border px-4 py-2">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(transaction.endDate))}
                        </td>
                        <td className="border px-4 py-2">
                          {transaction.status}
                        </td>
                        <td className="border px-4 py-2">
                          {transaction.amount}
                        </td>
                        <td className="border px-4 py-2">
                          {transaction.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="border px-4 py-2 text-center text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
