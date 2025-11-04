"use server";

import { cookies } from "next/headers";

import type { CreatePostDto, CreatePostResponse } from "../../types/createPost";
import { revalidatePath } from "next/cache";

export async function createPost(
  createPostDto: CreatePostDto
): Promise<CreatePostResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "You must be logged in to create a reply.",
        data: null,
      };
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/create`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createPostDto),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to create reply.",
        data: null,
      };
    }

    const data = await response.json();
    revalidatePath("/");
    return { success: true, data, error: null };
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
