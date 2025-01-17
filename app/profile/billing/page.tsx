"use client";

import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

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

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <h2 className="text-xl md:text-2xl">Informasi Penagihan</h2>
        <Button>Verifikasi</Button>
        {transactionData ? (
          <div className="space-y-4 py-4">
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
