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
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_280px] gap-3 h-[360px]">
          
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