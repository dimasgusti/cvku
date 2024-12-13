import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, startDate, endDate, company, description, link, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: "User not logged in" });
    }

    try {
      
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      
      const newProject = await prisma.project.create({
        data: {
          title,
          startDate,
          endDate: endDate || null,
          company: company || null,
          description: description || null,
          link: link || null,
          userId: user.id, 
        },
      });

      return res.status(200).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ error: "Error creating project" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}