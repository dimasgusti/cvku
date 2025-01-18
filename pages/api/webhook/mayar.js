// pages/api/webhook/mayar.js
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { body } = req;
    
    // Establish MongoDB connection
    const client = await clientPromise;
    const db = client.db('cvku');  // Replace with your database name
    const collection = db.collection('transaction');  // Replace with your collection name

    // Insert the incoming data into MongoDB
    const result = await collection.insertOne(body);

    return res.status(200).json({ message: 'Data saved successfully', result });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}