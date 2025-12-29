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
        const first = updated.shift(); // remove first
        if (first) updated.push(first); // add to end
        return updated;
      });
    }, 3000); // scroll every 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md rounded-md border bg-white h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-green-600 px-4 py-2 font-semibold text-white shrink-0">
        Notifications
      </div>

      {/* Scrolling Area */}
    <div className="flex-1 overflow-hidden">
        <ul>
            {items.map((item) => (
            <li
                key={item.id}
                className="border-b px-4 py-3 text-sm text-black last:border-b-0"
            >
                {item.url ? (
                    <Link
                        href={item.url}
                        className="text-black hover:text-green-700 hover:underline"
                    >
                        {item.title}
                    </Link>
                ) : (
                    <span className="text-black">{item.title}</span>
                )}
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
}
