import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { body } = req;

    if (body.event === "payment.received") {
      const createdAt = new Date(body.data.createdAt);
      const endDate = new Date(createdAt);
      endDate.setFullYear(createdAt.getFullYear() + 1);

      body.data.endDate = endDate.getTime(); 
    }

    const client = await clientPromise;
    const db = client.db('cvku');
    const collection = db.collection('transaction');

    const result = await collection.insertOne(body);

    return res.status(200).json({ message: 'Data saved successfully', result });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}