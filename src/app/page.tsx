import Link from "next/link";
import { OnMindLogo } from "@/components/logo";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:gap-4">
        <OnMindLogo className="h-16" color="#007056" />
        <span className="text-[54px] font-semibold text-[#737373] leading-none md:-translate-y-[2px]">Marketing</span>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 bg-[#007056] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00876D] transition-colors"
      >
        Dashboard
      </Link>
    </div>
  );
}
