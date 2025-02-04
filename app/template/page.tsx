"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TemplatePage() {
  const router = useRouter();

  const templates = [
    {
      id: 1,
      name: "Basic (Free)",
      description: "Tampilan bersih dan elegan untuk kesan profesional.",
      image: "/template/basic.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
    {
      id: 2,
      name: "Minimalist (Free)",
      description: "Desain modern dengan warna kontras yang menarik.",
      image: "/template/minimalist.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
    {
      id: 3,
      name: "Santika",
      description: "Desain modern dengan warna kontras yang menarik.",
      image: "/template/minimalist.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
    {
      id: 4,
      name: "Semilir",
      description: "Desain modern dengan warna kontras yang menarik.",
      image: "/template/minimalist.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
    {
      id: 5,
      name: "Swara",
      description: "Desain modern dengan warna kontras yang menarik.",
      image: "/template/minimalist.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-start">
      <div className="md:h-32 lg:h-40 w-full bg-primary text-primary-foreground flex flex-col justify-center items-center text-center py-8 md:py-4 lg:py-0">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif">
          Template
        </h1>
        <p>Temukan template yang mencerminkan kepribadian Anda</p>
      </div>
      <div className="w-full px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-100"
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{template.name}</h2>
              <p className="text-sm text-gray-600">{template.description}</p>
              <Button
                className="mt-2 w-full"
                onClick={() => router.push(template.previewUrl)}
              >
                Lihat Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
