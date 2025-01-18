interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  canonical?: string;
  image?: string;
}

export const defaultMeta: MetaTags = {
  title: "CVKU.id - Build Your Professional Portfolio",
  description: "Create, manage, and share your professional portfolio with CVKU.id. Showcase your skills, work experience, and achievements.",
  keywords: "portfolio, CV, resume, professional, showcase",
  robots: "index, follow",
  canonical: "https://www.cvku.id",
  image: "https://www.cvku.id/images/og-image.png",
};

export const generateMetaTags = ({
  title,
  description,
  keywords = defaultMeta.keywords,
  robots = defaultMeta.robots,
  canonical = defaultMeta.canonical,
  image = defaultMeta.image,
}: MetaTags) => {
  return {
    title,
    description,
    keywords,
    robots,
    canonical,
    image,
  };
};