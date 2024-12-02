import { Metadata } from "next";

const metadata: Metadata = {
  title: "CVku | Build Your Professional CV Online",
  description: "Easily create and share your professional CV and portfolio online.",
  applicationName: "CVku",
  keywords: ["CV", "Portfolio", "Resume Builder", "Online CV", "Professional"],
  authors: [{ name: "Your Name", url: "https://cvku.id" }],
  creator: "Your Name",
  themeColor: "#ffffff",
  openGraph: {
    title: "CVku | Build Your Professional CV Online",
    description: "Easily create and share your professional CV and portfolio online.",
    url: "https://cvku.id",
    siteName: "CVku",
    images: [
      {
        url: "https://cvku.id/og-image.png",
        width: 1200,
        height: 630,
        alt: "CVku Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVku | Build Your Professional CV Online",
    description: "Easily create and share your professional CV and portfolio online.",
    images: ["https://cvku.id/twitter-image.png"],
  },
};

export default metadata;