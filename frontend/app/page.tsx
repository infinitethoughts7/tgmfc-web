
import HeroSection from "./components/sections/HeroSection";
import ExploreDepartmentsSection from "./components/sections/ExploreDepartmentsSection";


export default function Home(){
  return (
      <div className="bg-slate-100 min-h-screen w-full overflow-x-hidden">
        <HeroSection />
        <ExploreDepartmentsSection />
    </div>
  )
} 