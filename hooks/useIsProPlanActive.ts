import { useEffect, useState } from "react";

export function useIsProPlanActive(email: string | undefined) {
  const [isProPlanActive, setIsProPlanActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      try {
        if (!email) return;

        const response = await fetch(`/api/transaction/getTransactionByEmail?email=${email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        if (data.success) {
          const activeTransaction = data.transactions.find((transaction: any) => {
            const endDate = new Date(transaction.endDate);
            return endDate >= new Date();
          });
          setIsProPlanActive(!!activeTransaction);
        }
      } catch (error) {
        console.error("Error checking Pro Plan status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStatus();
  }, [email]);

  return { isProPlanActive, loading };
}