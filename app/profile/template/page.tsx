export default function Template() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 pt-4 pb-8">
        <h2 className="text-xl md:text-2xl">Browse Template</h2>
      </div>
      <div className="flex flex-row flex-wrap gap-4 w-full h-full">
        <div className="w-40 h-40 bg-black"></div>
        <div className="w-70 h-60 bg-black"></div>
        <div className="w-40 h-40 bg-black"></div>
        <div className="w-90 h-80 bg-black"></div>
        <div className="w-40 h-20 bg-black"></div>
      </div>
    </div>
  );
}
