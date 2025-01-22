import { Monitor } from "lucide-react";

export default function Features() {
  return (
    <section className="flex flex-col justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 pt-4 pb-8">
        <div className="flex flex-col justify-start items-start gap-4">
          <div>
            <p>Fitur</p>
            <h2 className="text-xl md:text-2xl">Menyesuaikan Kebutuhan Anda</h2>
            <p>
              Didesain untuk memudahkan Anda menciptakan CV yang mencerminkan
              siapa Anda sebenarnya.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <Monitor />
              <h2 className="text-xl md:text-2xl mt-4">
                Bangun Resume Anda dengan Mudah dan Elegan
              </h2>
              <p>
                Buat resume profesional yang menonjolkan keterampilan unik Anda.
              </p>
            </div>
            <div>
              <Monitor />
              <h2 className="text-xl md:text-2xl mt-4">
                Terhubung dan Berinteraksi dengan Audiens Anda
              </h2>
              <p>Bagikan pengalaman dan wawasan Anda dengan mudah.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
