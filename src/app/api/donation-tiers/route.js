import { donationTiersService } from "@/lib/donation-tiers-service";
import { NextResponse } from "next/server";

export async function GET() {
  const tiers = await donationTiersService.getAll();
  return NextResponse.json(tiers);
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.tierId || !data.label || !data.heading) {
      return NextResponse.json(
        { error: "tier_id, label, and heading are required" },
        { status: 400 },
      );
    }

    const newTier = await donationTiersService.create(data);
    return NextResponse.json(newTier, { status: 201 });
  } catch (error) {
    console.error("Error creating donation tier:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create donation tier" },
      { status: 500 },
    );
  }
}
