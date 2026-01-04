import Notifications from "../sections/Notifications";
import OfficialCard from "../OfficialCard";
import officialsData from "../../mock/officials.json";
import ImageCarousel from "../ImageCarousel";

type Official = {
  id: number;
  name: string;
  designation: string;
  photo_url: string;
};

export default function HeroSection() {
  return (
    <div className="w-full py-2">
      <div className="max-w-7xl mx-auto px-4">

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Officials - Horizontal on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {officialsData.officials.map((official: Official) => (
              <div key={official.id} className="shrink-0 w-40">
                <OfficialCard official={official} />
              </div>
            ))}
          </div>

          {/* Carousel */}
          <div className="h-[250px]">
            <ImageCarousel />
          </div>

          {/* Notifications */}
          <div className="h-[300px]">
            <Notifications />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[180px_1fr_280px] gap-3 h-[360px]">
          {/* Officials - Left Column */}
          <div className="flex flex-col gap-1">
            {officialsData.officials.map((official: Official) => (
              <OfficialCard key={official.id} official={official} />
            ))}
          </div>

          {/* Carousel - Center Column */}
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