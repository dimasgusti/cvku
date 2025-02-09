import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku"

async function getTransactionsByEmail(email) {
    const client = new MongoClient(uri)
  try {
    await client.connect();

    const db = client.db(dbName)
    const collection = client.db().collection("transaction");

    const transactions = await collection.find({
        event: "payment.received",
        "data.status": "SUCCESS",
        "data.customerEmail": email,
        "data.productName": "Penagihan"
    })
    .sort({ "data.endDate": -1 })
    .toArray();

    if (transactions.length === 0) {
        return { transactions: [], isActive: false };
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const endDateTimestamp = transactions[0].data.endDate;
    const endDate = new Date(endDateTimestamp); 

    const isActive = endDate > todayDate;

    return { transactions, isActive };
  } catch (error) {
    console.error("Error querying transactions:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
    if(req.method === "GET") {
        const { email } = req.query;

        if(!email) {
            return res.status(400).json({ error: "Email is required "});
        }

        try {
            const { transactions, isActive } = await getTransactionsByEmail(email);

            return res.status(200).json({
                success: true,
                transactions: transactions.length > 0 ? transactions : [],
                isActive
            });
        } catch (error) {
            console.error("Error querying transactions:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}