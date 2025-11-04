"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";
import { SignUpForm } from "@/components/sign-up-form";
import { Button } from "@/components/ui/button";
import { MdArrowBack } from "react-icons/md";
export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost">
          <MdArrowBack /> Back
        </Button>
      </Link>

      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm onToggleForm={handleToggleForm} />
        ) : (
          <SignInForm onToggleForm={handleToggleForm} />
        )}
      </div>
    </main>
  );
}
