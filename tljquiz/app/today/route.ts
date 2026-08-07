import { NextResponse, type NextRequest } from "next/server";
import { getDailyScenario } from "@/data/scenarios";

export function GET(request: NextRequest) {
  const daily = getDailyScenario();
  return NextResponse.redirect(new URL(`/scenario/${daily.id}`, request.url));
}
