import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

    type QuestionsProps = {
    title: string;
    answer: string;
  };
  
  type Props = {
    heading: string;
    description: string;
    footerHeading: string;
    footerDescription: string;
    questions: QuestionsProps[];
  };
  
  export type Faq1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;
  
  export const Faq1 = (props: Faq1Props) => {
    const { heading, description, questions, footerHeading, footerDescription } = {
      ...Faq1Defaults,
      ...props,
    };
    return (
      <section id="relume" className="flex flex-col justify-center items-center min-h-[30rem] py-16">
        <div className="container w-full md:max-w-4xl px-4">
          <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
            <h2 className="rb-5 font-bold text-xl md:text-2xl">
              {heading}
            </h2>
            <p className="">{description}</p>
          </div>
          <Accordion type="multiple">
            {questions.map((question, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="md:py-5 md:text-md">{question.title}</AccordionTrigger>
                <AccordionContent className="md:pb-6">{question.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
            <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
              {footerHeading}
            </h4>
            <p className="md:text-md">{footerDescription}</p>
            <div className="mt-6 md:mt-8">
              {/* <Button {...button}>{button.title}</Button> */}
            </div>
          </div>
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
        answer:
          "Ya, kami menawarkan paket Starter yang sepenuhnya gratis untuk digunakan. Dengan paket ini, Anda bisa membuat CV online, menggunakan template dasar, dan membagikan URL unik CV Anda.",
      },
      {
        title: "Apa saja perbedaan antara paket Starter dan Pro?",
        answer:
          "Paket Starter menyediakan fitur dasar seperti membuat CV Online dan menggunakan 2 template standar. Sementara itu, paket Pro memberikan akses ke fitur premium seperti eksport PDF, 10+ template profesional, dan kemampuan menambahkan media seperti gambar atau video.",
      },
      {
        title: "Apakah saya bisa mengedit CV saya setelah disimpan?",
        answer:
          "Tentu! Anda dapat mengedit CV Anda kapan saja. Semua perubahan akan tersimpan, sehingga Anda tidak perlu khawatir kehilangan data.",
      },
      {
        title: "Bagaimana cara membagikan CV saya kepada perekrut atau klien?",
        answer:
          "Setiap CV yang Anda buat memiliki URL unik sesuai dengan username Anda. URL bisa dibagikan langsung melalui email, media sosial, atau aplikasi perpesanan.",
      },
      {
        title: "Apakah ada batasan jumlah CV yang bisa saya buat?",
        answer:
          "Untuk pengguna Starter, Anda dapat membuat 1 CV Online. Namun, pengguna Pro dapat membuat CV Online yang dapat di ekspor PDF sebanyak mungkin sesuai kebutuhan, seperti melamar pekerjaan atau menarik klien baru.",
      },
    ],
    footerHeading: "Tidak menemukan jawaban?",
    footerDescription: "Anda bisa hubungi kontak dibawah."
  };
  