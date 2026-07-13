import { donationTiersService } from "@/lib/donation-tiers-service";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const tier = await donationTiersService.getById(id);

  if (!tier) {
    return NextResponse.json({ error: "Tier not found" }, { status: 404 });
  }

  return NextResponse.json(tier);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const updated = await donationTiersService.update(id, data);

    if (!updated) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update donation tier" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const success = await donationTiersService.delete(id);

  if (!success) {
    return NextResponse.json({ error: "Tier not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Tier deleted successfully" });
}
