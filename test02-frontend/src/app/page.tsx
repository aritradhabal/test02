import Link from "next/link";
import { CommentsSection } from "@/components/comments-section";
import { Button } from "@/components/ui/button";
import type { Comment } from "../types/comment";
import { getAllPosts } from "./actions/getAllPosts";
import { getAuthStatus } from "./actions/getAuthStatus";

export default async function Home() {
  const posts: Comment[] = await getAllPosts();
  const user = await getAuthStatus();
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Comments</h1>
          <div className="flex gap-3">
            {user ? (
              <span className="text-foreground font-medium">
                {user.username}
              </span>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CommentsSection comments={posts} />
      </div>
    </main>
  );
}
