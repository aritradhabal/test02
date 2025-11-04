"use server";

import { cookies } from "next/headers";
import type { AuthStatus } from "@/types/authStatus";

export async function getAuthStatus(): Promise<AuthStatus | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/status`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`Failed to fetch auth status: ${response.statusText}`);
    }

    const userData = await response.json();
    return userData as AuthStatus;
  } catch (error) {
    console.error("Error fetching auth status:", error);
    return null;
  }
}
