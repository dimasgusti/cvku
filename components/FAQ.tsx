import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type QuestionsProps = {
  title: string;
  answer: string;
};

type Props = {
  heading: string;
  description: string;
  questions: QuestionsProps[];
};

export type Faq1Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Faq1 = (props: Faq1Props) => {
  const { heading, description, questions } =
    {
      ...Faq1Defaults,
      ...props,
    };
  return (
    <section
      id="relume"
      className="flex flex-col justify-center items-center min-h-[30rem] py-16"
    >
      <div className="container w-full md:max-w-4xl px-4">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 font-bold text-xl md:text-2xl">{heading}</h2>
          <p className="">{description}</p>
        </div>
        <Accordion type="multiple">
          {questions.map((question, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="md:py-5 md:text-md">
                {question.title}
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export const Faq1Defaults: Props = {
  heading: "FAQs",
  description:
    "Kami siap membantu! Jelajahi daftar pertanyaan ini untuk menemukan jawaban yang Anda cari.",
  questions: [
    {
      title: "Apakah CVKU gratis digunakan?",
      answer: "Ya! CVKU menyediakan paket Starter gratis selamanya.",
    },
    {
      title: "Apa saja perbedaan antara paket Starter dan Pro?",
      answer:
        "Paket Pro menawarkan fitur premium seperti eksport PDF, akses template premium, dan prioritas dukungan pelanggan.",
    },
    {
      title: "Apakah saya bisa mengedit CV saya setelah disimpan?",
      answer: "Tentu saja! Anda dapat mengedit CV kapan saja sesuai kebutuhan.",
    },
    {
      title: "Bagaimana cara membagikan CV saya kepada perekrut atau klien?",
      answer:
        "Anda dapat membagikan CV Anda melalui URL eksklusif yang mencantumkan username Anda. URL ini mudah diingat dan profesional.",
    },
    {
      title: "Apakah saya bisa membuat lebih dari 1 CV?",
      answer:
        "Saat ini, setiap pengguna hanya dapat membuat 1 CV per profil, namun Anda bisa mengedit dan memperbarui CV tersebut sesuai kebutuhan kapan saja.",
    },
  ],
};
