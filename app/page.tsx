import HeroSection from "@/components/HeroSection";
import { StaticContent } from "@/components/StaticContent";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* 静态内容区域，利于 SEO */}
      <div className="bg-white">
        <StaticContent />
      </div>
    </main>
  );
}