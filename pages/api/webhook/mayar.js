import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Verify secret for security
    const secret = req.headers.authorization; // "Bearer my-secret-token"
    if (secret !== `Bearer ${process.env.MAYAR_WEBHOOK_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Extract the payload
      const { event, data } = req.body;

      // Log the incoming data (for debugging)
      console.log('Received Event:', event);
      console.log('Data:', data);

      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URL);
      const db = client.db('cvku');

      // Save the full payload to a collection
      await db.collection('maya_events').insertOne({
        event,
        data,
        receivedAt: new Date(),
      });

      // Update user subscription if the status is SUCCESS
      if (data.status === 'SUCCESS') {
        await db.collection('users').updateOne(
          { userId: data.customerEmail }, // Use customerEmail as user identifier
          {
            $set: {
              subscriptionStatus: 'active',
              updatedAt: new Date(),
            },
          },
          { upsert: true } // Create the user if not exists
        );
      }

      // Respond with success
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling webhook:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}