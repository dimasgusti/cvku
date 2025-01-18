"use client";

import { Check, Copy, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";

interface Transaction {
  email: string;
  mobile: string;
  id: string;
  status: string;
  paymentMethod: string;
  membership: string;
  credit: number;
  created: string;
}

export default function Billing() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!session?.user?.email) return;
    navigator.clipboard.writeText(session.user.email);
    setCopied(true);
    toast("Email Copied.");
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  useEffect(() => {
    if (session?.user?.email) {
      const fetchTransactionData = async () => {
        try {
          const response = await fetch(
            `/api/payment/checkPaymentStatus?email=${session.user?.email}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch transaction data");
          }
          const data = await response.json();
          setTransactionData(data.transactions);
        } catch (error) {
          console.error(error || "An error occurred while fetching the data");
        } finally {
          setLoading(false);
        }
      };

      fetchTransactionData();
    }
  }, [session?.user?.email]);

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  const latestTransaction = transactionData
    .slice()
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )[0];

  const expirationDate = latestTransaction
    ? new Date(
        new Date(latestTransaction.created).setMonth(
          new Date(latestTransaction.created).getMonth() + 1
        )
      )
    : null;

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <h2 className="text-xl md:text-2xl">Subscription</h2>
        <Card>
          <CardHeader>
            <CardDescription>You are on</CardDescription>
            <CardTitle>
              {latestTransaction ? "CVKU Pro" : "CVKU Free"}
            </CardTitle>
          </CardHeader>
          {latestTransaction ? (
            <CardContent>
              <CardDescription>Until</CardDescription>
              <CardDescription>
                {expirationDate ? expirationDate.toLocaleDateString() : "N/A"}
              </CardDescription>
            </CardContent>
          ) : (
            <CardContent>
              <CardDescription className="flex flex-row gap-1">
                Subscribe now
                <Dialog>
                  <DialogTrigger className="underline">Here</DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Important!</DialogTitle>
                    <DialogDescription>
                      Use your CVKU email{" "}
                      <span
                        onClick={() => {
                          handleCopy();
                        }}
                        className="hover:cursor-pointer underline inline-flex items-center gap-1"
                        title="Click to copy"
                      >
                        ({session?.user?.email}){" "}
                        {copied ? (
                          <Check size={14} className="text-green-500 mr-1" />
                        ) : (
                          <Copy size={14} className="text-gray-500 mr-1" />
                        )}
                      </span>
                      on the payment page. <br />
                      Failure to do so may prevent activation of your CVKU Pro
                      account.
                    </DialogDescription>
                    <DialogFooter>
                      <Link
                        href="/https://cv-ku.myr.id/membership/cvku-29354"
                        target="_blank"
                      >
                        <Button>Continue</Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardDescription>
            </CardContent>
          )}
        </Card>
        <Separator />
        <h2 className="text-xl md:text-2xl">Verify your Payment</h2>

        <Separator />
        <h2 className="text-xl md:text-2xl">Payment History</h2>
        {transactionData ? (
          <div className="space-y-4">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">No</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(transaction.created).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Dialog>
                        <DialogTrigger>Detail</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transaction Detail</DialogTitle>
                            <DialogDescription>
                              Transaction ID: {transaction.id}
                            </DialogDescription>
                            <DialogDescription>
                              Email: {transaction.email}
                            </DialogDescription>
                            <DialogDescription>
                              Mobile: {transaction.mobile}
                            </DialogDescription>
                            <DialogDescription>
                              Payment Method: {transaction.paymentMethod}
                            </DialogDescription>
                            <DialogDescription>
                              Membership: {transaction.membership}
                            </DialogDescription>
                            <DialogDescription>
                              Credit: {transaction.credit}
                            </DialogDescription>
                            <DialogDescription>
                              Created: {transaction.created}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-black/70">
              Semua transaksi di atas berstatus &quot;Berhasil&quot;.
            </p>
          </div>
        ) : (
          <div>
            <p>Tidak ada data</p>
          </div>
        )}
      </div>
    </div>
  );
}
