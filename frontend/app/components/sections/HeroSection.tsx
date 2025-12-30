import Notifications from "../sections/Notifications";
import notificationsData from "../../mock/notifications.json";
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
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-0">
          
          <div className="w-full h-[320px] flex flex-col space-y-2 p-2">
            {officialsData.officials.map((official: Official) => (
              <OfficialCard key={official.id} official={official} />
            ))}
          </div>

          <div className="w-full h-[320px]">
            <ImageCarousel />
          </div>

          <div className="w-full h-[320px] p-2">
            <Notifications notifications={notificationsData.notifications} />
          </div>
          
        </div>
      </div>

    </div>
  );
}