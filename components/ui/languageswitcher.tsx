import Link from "next/link";

export default function LanguageSwitcher() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Link href="/">ID</Link>|<Link href="/en">EN</Link>
    </div>
  );
}
