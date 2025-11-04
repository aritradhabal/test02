"use server";

export async function getAllPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Posts");
  }
  const posts = await res.json();
  return posts;
}
