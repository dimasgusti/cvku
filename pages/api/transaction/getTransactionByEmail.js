import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku";

async function getTransactionsByEmail(email) {
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const transactionsCollection = db.collection("transaction");

    const transactions = await transactionsCollection
      .find({
        event: "payment.received",
        status: "SUCCESS",
        customerEmail: email,
        productName: "Penagihan",
      })
      .toArray();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const isSubscriptionValidToday = transactions.some(transaction => {
      const endDate = new Date(transaction.endDate); 
      return todayStart <= endDate; 
    });

    return { transactions, isSubscriptionValidToday };
  } catch (error) {
    console.error("Error querying transactions:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const { transactions, isSubscriptionValidToday } = await getTransactionsByEmail(email);

      return res.status(200).json({
        success: true,
        transactions: transactions.length > 0 ? transactions : [],
        isSubscriptionValidToday
      });
    } catch (error) {
      console.error("Error querying transactions:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}