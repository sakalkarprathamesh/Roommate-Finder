export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const listings = await prisma.listing.findMany({
      include: {
        owner: { include: { profile: true } },
        _count: { select: { contactRequests: true, reports: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Admin fetch listings error:", error);
    return NextResponse.json({ error: "Failed to load listings" }, { status: 500 });
  }
}
