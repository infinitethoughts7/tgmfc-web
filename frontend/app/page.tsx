import HeroSection from "./components/sections/HeroSection";
import Navbar from "./components/sections/NavBar";
import TopHeader from "./components/sections/TopHeader";
export default function Home(){
  return ( 
      <div className="bg-slate-100 h-screen w-screen">
        <TopHeader />
        <Navbar />
    </div>
  )
} 