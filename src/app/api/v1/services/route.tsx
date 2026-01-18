import { NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";
import { MyResponse } from "@/types";
import { Service } from "@/contexts/BookingContext";

export async function GET() {
  const { data, error } = await supabase
    .from("services")
    .select<"*", Service>("*");
  if (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: error.message,
    };
    return NextResponse.json(resp, { status: 500 });
  }
  const resp: MyResponse<Service[]> = {
    data: data,
    message: null,
  };
  return NextResponse.json(resp);
}
