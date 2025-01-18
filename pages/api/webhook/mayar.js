import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 1. Verify the secret token for security
    const secret = req.headers.authorization; // "Bearer my-secret-token"
    if (secret !== `Bearer ${process.env.MAYAR_WEBHOOK_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Parse the data sent by Pipedream
    const { event, amount, customer_id, status } = req.body;

    // 3. Save the data to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    const db = client.db('cvku');
    await db.collection('maya_webhooks').insertOne({
      event,
      amount,
      customer_id,
      status,
      receivedAt: new Date(),
    });

    // 4. (Optional) Update user subscription if payment is successful
    if (event === 'payment.success' && status === 'success') {
      await db.collection('users').updateOne(
        { userId: customer_id },
        { $set: { subscriptionStatus: 'active' } }
      );
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}