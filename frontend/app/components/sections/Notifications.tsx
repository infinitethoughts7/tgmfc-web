"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotifications } from "../../lib/api/api";

type Notification = {
  id: number;
  title: string;
  url?: string;
};

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setItems(data.notifications || []);
        setLoading(false);
      } catch {
        setError('Failed to load notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setItems((prev) => {
          const updated = [...prev];
          const first = updated.shift();
          if (first) updated.push(first);
          return updated;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [items]);

  return (
    <div className="w-full rounded-lg bg-white h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 px-4 py-2.5 font-semibold text-white shrink-0 rounded-t-lg">
        Notifications
      </div>

      {/* Scrolling Area */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-500">Loading notifications...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        ) : (
          <ul className="h-full">
            {items.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                {item.url ? (
                  item.url.startsWith('http://') || item.url.startsWith('https://') ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-green-700 hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link
                      href={item.url}
                      className="text-gray-800 hover:text-green-700 hover:underline"
                    >
                      {item.title}
                    </Link>
                  )
                ) : (
                  <span className="text-gray-800">{item.title}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}