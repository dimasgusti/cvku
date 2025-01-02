import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string;
    };
  }
}

declare module 'next-auth/jwt/types' {
  interface JWT {
    uid: string;
  }
}

declare module 'country-region-data/dist/data-umd' {
  const countryRegionData: {
    countryName: string;
    countryShortCode: string;
    regions: { name: string; shortCode: string }[];
  }[];

  export default countryRegionData;
}