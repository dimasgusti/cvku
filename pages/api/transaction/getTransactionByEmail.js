import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku";  

async function getTransactionByEmail(email) {
  if(!uri){
    throw new Error("MongoDB URI is not defined in environment variables.")
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const transactionsCollection = db.collection("transaction");

    const transaction = await transactionsCollection.findOne({ customerEmail: email });

    return transaction || null;
  } catch (error) {
    console.error("Error querying transaction:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
    if(req.method === "GET"){
        const { email } = req.query;

        if(!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        try {
            const transaction = await getTransactionByEmail(email);

            if(!transaction) {
              return res.status(404).json({ error: "Transaction not found" });

            }
            res.status(200).json(transaction);
        } catch (error) {
          console.error("Error querying transaction:", error.message);
          res.status(500).json({ error: "Internal server error" });
        }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
}
