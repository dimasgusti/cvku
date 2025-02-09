import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === "POST") {

    const { mayarId, mobile, status, paymentMethod, membership, credit, createdAt } = req.body;

    if (!mayarId || !status || !paymentMethod || !membership || credit === undefined || !createdAt) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const createdDate = new Date(createdAt);
    const endsAt = new Date(createdDate);
    endsAt.setMonth(createdDate.getMonth() + 1);

    try {
      const newTransaction = await prisma.transaction.create({
        data: {
          userId: session.user.id, 
          mayarId,                  
          mobile,
          status,
          paymentMethod,
          membership,
          credit,
          createdAt: createdDate,   
          endsAt,                   
        },
      });

      res.status(201).json(newTransaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating new transaction." });
    }
  } else if (req.method === "GET"){
    const { email } = req.query;

    if(!email){
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("cvku");

      const transactions = await db.collection("transactions").find({ 
        "data.customerEmail": email,
      }).toArray();

      console.log(transactions)

      return res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error fetching transactions" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}