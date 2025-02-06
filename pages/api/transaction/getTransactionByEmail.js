import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    if(req.method === 'GET') {
        try {
            const { email } = req.query;

            if(!email) {
                return res.status(400).json({ error: "Email is required." });
            }

            const client = await clientPromise;
            const collection = client.db().collection("transaction");

            const transactions = await collection.find({
                event: "payment.received",
                "data.status": "SUCCESS",
                "data.customerEmail": email, 
                "data.productName": "Penagihan"
              }).toArray();

              if (transactions.length === 0) {
                return res.status(404).json({ error: "User not found." });
            }

            if(!transactions){
                return res.status(404).json({ error: "User not found." });
            }

            const today = new Date();

            const isSubscriptionValidToday = transactions.some(transaction => {
                const endDate = transaction.data.endDate; 
                const subscriptionEndDate = new Date(endDate); 
                return subscriptionEndDate > today; 
            });

            res.status(200).json({
                transactions,
                isSubscriptionValidToday
            });
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Failed to fetch user." });
        }
    }
}