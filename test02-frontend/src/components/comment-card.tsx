"use client";

import { useState } from "react";
import type { Comment } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createReply } from "@/app/actions/createReply";
import { OperationType } from "@/types/createReply";
interface CommentCardProps {
  comment: Comment;
  depth: number;
}

export function CommentCard({ comment, depth }: CommentCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [votes, setVotes] = useState(comment.resultValue);
  const [numberInput, setNumberInput] = useState("");
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const router = useRouter();
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 8;
  const isMaxDepth = depth >= maxDepth;

  const indentStyle =
    depth > 0 ? { marginLeft: `${Math.min(depth * 3, 12) * 0.25}rem` } : {};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getOperationSymbol = (operation: string | null) => {
    const operationMap: Record<string, string> = {
      ADD: "+",
      SUBTRACT: "-",
      MULTIPLY: "×",
      DIVIDE: "÷",
    };
    return operationMap[operation || ""] || operation;
  };

  const handleReply = async () => {
    if (!numberInput.trim()) return;

    setIsLoadingReply(true);

    const response = await createReply({
      parentId: comment.id,
      operationType: selectedOperator as OperationType,
      rightHandNumber: Number(numberInput),
    });
    if (response.success) {
      toast.success("Replied successfully");
      router.refresh();
    } else {
      toast.error(response.error || "Failed to post reply");
    }
    setShowReplyForm(false);
    setNumberInput("");
    setSelectedOperator(null);
    toast.success("Replied successfully");
    router.refresh();
    setIsLoadingReply(false);
  };

  return (
    <div style={indentStyle}>
      <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
        {/* Header with author info */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              {comment.author.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {comment.author.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>

          {hasReplies && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-md p-1 hover:bg-muted"
              aria-label={isExpanded ? "Collapse replies" : "Expand replies"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>

        {comment.operationType ? (
          <div className="mb-4 bg-muted/30 rounded-md p-3 border border-border/50">
            <p className="text-sm font-mono text-foreground">
              <span className="font-semibold text-primary">
                {comment.resultValue}
              </span>
              <span className="text-muted-foreground mx-2">=</span>
              <span className="text-muted-foreground">Previous Result</span>
              <span className="mx-2 font-semibold text-primary">
                {getOperationSymbol(comment.operationType)}
              </span>
              <span className="font-semibold text-primary">
                {comment.rightHandNumber}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Operation: {comment.operationType}
            </p>
          </div>
        ) : (
          <div className="mb-4 bg-muted/30 rounded-md p-3 border border-border/50">
            <p className="text-sm font-mono text-foreground">
              <span className="font-semibold text-primary text-lg">
                {comment.resultValue}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Initial value</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {!isMaxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted"
            >
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Reply</span>
            </button>
          )}

          {hasReplies && !isExpanded && (
            <span className="text-sm text-muted-foreground">
              {comment.replies?.length}{" "}
              {comment.replies?.length === 1 ? "reply" : "replies"}
            </span>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-4 border-t border-border pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Enter Number
              </label>
              <input
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Enter a number..."
                disabled={isLoadingReply}
                className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Select Operator (Optional)
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "+", value: "ADD" },
                  { label: "−", value: "SUBTRACT" },
                  { label: "×", value: "MULTIPLY" },
                  { label: "÷", value: "DIVIDE" },
                ].map((op) => (
                  <button
                    key={op.value}
                    onClick={() =>
                      setSelectedOperator(
                        selectedOperator === op.value ? null : op.value
                      )
                    }
                    disabled={isLoadingReply}
                    className={`relative h-12 rounded-sm font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedOperator === op.value
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 "
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border/50"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleReply}
                disabled={isLoadingReply || !numberInput.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingReply ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Replying...
                  </>
                ) : (
                  "Reply"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReplyForm(false)}
                disabled={isLoadingReply}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {hasReplies && isExpanded && (
        <div className="mt-2 space-y-2">
          {comment.replies?.map((reply) => (
            <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
