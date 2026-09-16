import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({
      page: data?.page_number || 1,
      device_type: data?.device_type || "pc",
      last_read_at: data?.last_read_at,
    });
  } catch (error) {
    console.error("Failed to fetch reading progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { page_number, device_type = "pc" } = body;

    if (!page_number || typeof page_number !== "number") {
      return NextResponse.json(
        { error: "Invalid page_number" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reading_progress")
      .upsert(
        {
          user_id: user.id,
          page_number,
          device_type,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      page: data.page_number,
    });
  } catch (error) {
    console.error("Failed to save reading progress:", error);
    return NextResponse.json(
      { error: "Failed to save reading progress" },
      { status: 500 }
    );
  }
}
