import Notifications from "../sections/Notifications";
import notificationsData from "../../mock/notifications.json";
import OfficialCard from "../OfficialCard";
import officialsData from "../../mock/officials.json";
import ImageCarousel from "../ImageCarousel";
import Image from "next/image";

type Official = {
  id: number;
  name: string;
  designation: string;
  photo_url: string;
};

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4">
        
        {/* Left Column: Officials Cards */}
        <div className="w-full h-full flex flex-col">
          <div className="space-y-4 h-full">
            {officialsData.officials.map((official: Official) => (
              <OfficialCard key={official.id} official={official} />
            ))}
          </div>
        </div>

        {/* Middle Column: Image Carousel */}
        <div className="w-full flex items-start">
          <ImageCarousel />
        </div>

        {/* Right Column: Notifications */}
        <div className="w-full h-full flex flex-col">
          <div className="h-full">
            <Notifications notifications={notificationsData.notifications} />
          </div>
        </div>

      </div>
    </div>
  );
}