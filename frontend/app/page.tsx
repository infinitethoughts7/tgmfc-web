
import TopHeader from "./components/sections/TopHeader";

import HeroSection from "./components/sections/HeroSection";
import NavBar from "./components/sections/NavBar";

export default function Home(){
  return (
      <div className="bg-slate-100 h-screen w-screen">
        <TopHeader />
        <NavBar />
        <HeroSection />
    </div>
  )
} 