import Image from "next/image";

type Official = {
  name: string;
  designation: string;
  photo_url: string;
};

export default function OfficialCard({ official }: { official: Official }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center rounded-xl p-2 bg-white shadow-sm border border-gray-100">

      {/* Photo */}
      <div className="relative h-24 w-24 rounded-lg border-2 border-green-500 bg-green-50 p-1">
        <Image
          src={official.photo_url}
          alt={official.name}
          fill
          className="rounded-md object-cover"
        />
      </div>

      {/* Name */}
      <h3 className="mt-1 text-center text-sm font-bold text-green-900 leading-tight">
        {official.name}
      </h3>

      {/* Designation */}
      <div className="mt-1 rounded-full bg-green-600 px-2 py-0.5 text-center text-xs font-semibold text-white">
        {official.designation}
      </div>
    </div>
  );
}
