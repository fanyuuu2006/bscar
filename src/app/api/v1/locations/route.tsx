import { NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";
import { MyResponse } from "@/types";
import { Location } from "@/contexts/BookingContext";

export async function GET() {
  const { data, error } = await supabase
    .from("locations")
    .select<"*", Location>("*");
  if (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: error.message,
    };
    return NextResponse.json(resp, { status: 500 });
  }
  const resp: MyResponse<Location[]> = {
    data: data,
    message: null,
  };
  return NextResponse.json(resp);
}
