import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle error cases
  if (error) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("error", error);
    if (errorDescription) {
      redirectUrl.searchParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Exchange code for session
  if (code) {
    try {
      const supabase = createServerClient();
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("error", "session_exchange_failed");
        return NextResponse.redirect(redirectUrl);
      }

      if (data?.session) {
        // Session successfully established, redirect to content
        return NextResponse.redirect(new URL("/content", request.url));
      }
    } catch (err) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("error", "callback_error");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}
