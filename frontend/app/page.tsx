
import TopHeader from "./components/sections/TopHeader";
import HeroSection from "./components/sections/HeroSection";
import NavBar from "./components/sections/NavBar";
import ExploreDepartmentsSection from "./components/sections/ExploreDepartmentsSection";


export default function Home(){
  return (
      <div className="bg-slate-100  w-screen">
        <TopHeader />
        <NavBar />
        <HeroSection />
        <ExploreDepartmentsSection />
    </div>
  )
} 