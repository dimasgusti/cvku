'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mayarId, createdAt } = req.body;

    if (!mayarId || !createdAt) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    try {
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          mayarId,
          createdAt: new Date(createdAt),
        },
      });

      if (existingTransaction) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error checking transaction existence" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}