"use client"

import { useState } from "react"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

export function LoginFlow() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        <p className="text-muted-foreground">
          {isSignUp ? "Join us and start your journey today" : "Sign in to your account to continue"}
        </p>
      </div>

      <div className="h-fit">
        {!isSignUp ? (
          <SignInForm onToggleForm={() => setIsSignUp(true)} />
        ) : (
          <SignUpForm onToggleForm={() => setIsSignUp(false)} />
        )}
      </div>
    </div>
  )
}
