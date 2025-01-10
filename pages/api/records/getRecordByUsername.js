import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required.' });
    }

    try {
      const records = await prisma.record.findMany({
        where: {
          username: username,
        },
      });

      return res.status(200).json(records); 
    } catch (error) {
      console.error('Error querying records by username:', error.message);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }
}