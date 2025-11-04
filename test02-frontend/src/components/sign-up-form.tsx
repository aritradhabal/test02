"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signup } from "@/app/actions/signUp";
import { useRouter } from "next/navigation";
interface SignUpFormProps {
  onToggleForm: () => void;
}

export function SignUpForm({ onToggleForm }: SignUpFormProps) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signup(formData);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Signup failed");
    } else {
      router.push("/");
    }
  };

  return (
    <Card className="p-6 border border-border bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="username-signup"
            className="text-sm font-medium text-foreground"
          >
            Username
          </label>
          <Input
            id="username-signup"
            name="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password-signup"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <Input
            id="password-signup"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={onToggleForm}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </Card>
  );
}
