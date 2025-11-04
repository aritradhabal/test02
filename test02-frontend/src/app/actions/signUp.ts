"use server";

import { cookies } from "next/headers";
import type { SignupState } from "@/types/SignupState";

export async function signup(formData: FormData): Promise<SignupState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      success: false,
      error: "Username and password are required.",
      data: null,
    };
  }

  const signupDto = { username, password };
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupDto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return {
        success: false,
        error: errorData.message || "Signup failed. Please try again.",
        data: null,
      };
    }

    const token = await response.text();

    if (!token) {
      console.error("API Error: No token in response");
      return {
        success: false,
        error: "Signup successful, but token was not received.",
        data: null,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    return { success: true, data: token, error: null };
  } catch (error) {
    console.error("Network Error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message, data: null };
    }
    return {
      success: false,
      error: "An unknown error occurred.",
      data: null,
    };
  }
}
