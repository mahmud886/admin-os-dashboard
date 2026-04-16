"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function VisitLocation({ gaData }) {
  const locations = gaData?.visitLocation ?? [];
  const configured = gaData?.configured === true;

  if (!configured) return null;

  return (
    <Card className="bg-[#111111] border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <MapPin className="h-4 w-4" />
          SITE VISIT LOCATION (30D)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <p className="text-sm text-gray-500">
            No location data yet. Configure GA4 Data API with GA4_PROPERTY_ID
            and service account to see countries and cities.
          </p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {locations.map((loc, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded border border-border/50 bg-black/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-white">
                  {loc.country}
                  {loc.city ? `, ${loc.city}` : ""}
                </span>
                <span className="text-teal-400">
                  {loc.users?.toLocaleString() ?? 0} users
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
