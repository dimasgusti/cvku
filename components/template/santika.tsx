"use client";

import { Profile } from "@/lib/interfaces";
// import countries from "i18n-iso-countries";

interface DefaultTemplateProps {
  user: Profile;
}

// type ItemWithYear = {
//   year?: string | number;
//   fromMonth?: string;
// };

// type Certification = {
//   issued?: string | number;
//   expires?: string | number;
// };

// type Education = {
//   from?: string | number;
//   to?: string | number;
// };

// export default function SantikaTemplate({ user }: DefaultTemplateProps) {
export default function SantikaTemplate(){
  // const hasRecords =
  //   (user?.project ?? []).length > 0 ||
  //   (user?.experience ?? []).length > 0 ||
  //   (user?.award ?? []).length > 0 ||
  //   (user?.certification ?? []).length > 0 ||
  //   (user?.education ?? []).length > 0 ||
  //   (user?.volunteer ?? []).length > 0;

  // const getCountryName = (countryCode: string): string => {
  //   if (!countryCode) return "Unknown Country";

  //   const upperCaseCode = countryCode.toUpperCase();
  //   return countries.getName(upperCaseCode, "en") || "Unknown Country";
  // };

  // const sortByDate = (
  //   a: ItemWithYear | Certification | Education,
  //   b: ItemWithYear | Certification | Education
  // ): number => {
  //   const getYear = (
  //     item: ItemWithYear | Certification | Education
  //   ): number => {
  //     if ("year" in item && item.year) {
  //       return typeof item.year === "string" && item.year !== "ongoing"
  //         ? new Date(`${item.fromMonth || "Jan"} 1, ${item.year}`).getTime()
  //         : 0;
  //     }

  //     if ("issued" in item && item.issued) {
  //       return new Date(item.issued).getTime();
  //     }

  //     if ("from" in item && item.from) {
  //       return new Date(item.from).getTime();
  //     }

  //     return 0;
  //   };

  //   const yearA = getYear(a);
  //   const yearB = getYear(b);

  //   if (
  //     "year" in a &&
  //     a.year === "ongoing" &&
  //     "year" in b &&
  //     b.year !== "ongoing"
  //   )
  //     return -1;
  //   if (
  //     "year" in b &&
  //     b.year === "ongoing" &&
  //     "year" in a &&
  //     a.year !== "ongoing"
  //   )
  //     return 1;

  //   return yearB - yearA;
  // };

  return (
      <div className="flex flex-col justify-center items-center h-screen w-full">

      </div>
  );
}
