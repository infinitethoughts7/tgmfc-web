import HeroSection from "./components/sections/HeroSection";
import ExploreDepartmentsSection from "./components/sections/ExploreDepartmentsSection";
import FeaturedNews from "./components/sections/FeaturedNews";

export default function Home() {
  return (
    <div className="bg-slate-100 min-h-screen w-full overflow-x-hidden">
      <HeroSection />
      <FeaturedNews />
      <ExploreDepartmentsSection />
    </div>
  );
} 