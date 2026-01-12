import Image from "next/image";

type Official = {
  name: string;
  designation: string;
  photo_url: string;
};

export default function OfficialCard({ official }: { official: Official }) {
  return (
    <div className="h-full flex flex-col items-center justify-center rounded-xl p-2 bg-white shadow-lg border border-gray-100">

      {/* Photo */}
      <div className="relative h-20 w-20 lg:h-24 lg:w-24 rounded-lg border-1 border-green-500 bg-green- p-1">
        <Image
          src={official.photo_url}
          alt={official.name}
          fill
          className="rounded-md object-cover"
        />
      </div>

      {/* Name */}
      <h3 className="mt-1 text-center text-xs lg:text-sm font-bold text-green-900 leading-tight line-clamp-2">
        {official.name}
      </h3>

      {/* Designation */}
      <div className="mt-1 rounded-full bg-green-600 px-2 py-0.5 text-center text-[10px] lg:text-xs font-semibold text-white">
        {official.designation}
      </div>
    </div>
  );
}
