"use client";
import type { Comment } from "@/types/comment";
import { CommentCard } from "./comment-card";
import { useState } from "react";
import { createPost } from "@/app/actions/createPost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

interface CommentsSectionProps {
  comments: Comment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  const [initialValue, setInitialValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Create a map for quick lookup
  const commentMap = new Map<string, Comment>();
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Build the tree by attaching children to parents
  const rootComments: Comment[] = [];
  comments.forEach((comment) => {
    const mappedComment = commentMap.get(comment.id)!;
    if (comment.parentId === null) {
      rootComments.push(mappedComment);
    } else {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(mappedComment);
      }
    }
  });

  const handlePost = async () => {
    setIsLoading(true);
    try {
      const response = await createPost({
        startingNumber: Number(initialValue),
      });
      if (response.success) {
        toast.success("Post created successfully");
        setInitialValue("");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to create post");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setInitialValue("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
          Post
        </label>
        <input
          type="number"
          value={initialValue && Number(initialValue) > 0 ? initialValue : ""}
          onChange={(e) => setInitialValue(e.target.value)}
          placeholder="Enter initial number..."
          className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={isLoading}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={handlePost}
            disabled={!initialValue || Number(initialValue) <= 0 || isLoading}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                <span>Posting...</span>
              </>
            ) : (
              "Post"
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      {rootComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  );
}
