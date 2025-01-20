import { useEffect, useState } from "react";

export function useIsProPlanActive(email: string | undefined) {
  const [isProPlanActive, setIsProPlanActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          // Check if there's a message with "No transactions found"
          if (data.message && data.message === "No transactions found") {
            setErrorMessage(data.message); // Set the message if no transactions are found
            setIsProPlanActive(false);
          } else if (data.transactions && data.transactions.length > 0) {
            const activeTransaction = data.transactions.find((transaction: any) => {
              const endDate = new Date(transaction.endDate);
              return endDate >= new Date();
            });

            setIsProPlanActive(!!activeTransaction);
            setErrorMessage(null);
          }
        } else {
          setErrorMessage("Failed to fetch transactions.");
        }
      } catch (error) {
        console.error("Error checking Pro Plan status:", error);
        setErrorMessage("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStatus();
  }, [email]);

  return { isProPlanActive, loading, errorMessage };
}