import Notifications from "../sections/Notifications";
import ImageCarousel from "../ImageCarousel";

export default function HeroSection() {
  return (
    <div className="w-full py-2">
      <div className="max-w-7xl mx-auto px-4">

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Carousel */}
          <div className="h-[300px]">
            <ImageCarousel />
          </div>

          {/* Notifications */}
          <div className="h-[350px]">
            <Notifications />
          </div>
        </div>

        {/* Desktop Layout - Full Width */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_320px] gap-4 h-[450px]">
          {/* Carousel - Left Column (Expanded) */}
          <div className="h-full">
            <ImageCarousel />
          </div>

          {/* Notifications - Right Column */}
          <div className="h-full">
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
}