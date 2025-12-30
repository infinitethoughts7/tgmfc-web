"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: number;
  title: string;
  url?: string;
};

export default function Notifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const updated = [...prev];
        const first = updated.shift();
        if (first) updated.push(first);
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-lg border bg-white h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="border-b bg-green-600 px-4 py-3 font-semibold text-white shrink-0 rounded-t-lg">
        Notifications
      </div>

      {/* Scrolling Area */}
      <div className="flex-1 overflow-hidden">
        <ul className="h-full">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b px-4 py-3 text-sm text-gray-800 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              {item.url ? (
                <Link
                  href={item.url}
                  className="text-gray-800 hover:text-green-700 hover:underline"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-gray-800">{item.title}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}