"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

function getAuthErrorMessage(error: { message?: string; status?: number } | null): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  if (error.status === 429 || /rate limit|too many requests/i.test(error.message ?? "")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  return error.message || "An unexpected error occurred. Please try again.";
}

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();
    const trimmedPassword = password.trim();

    if (mode === "signup" && !trimmedFullName) {
      setError("Name is required.");
      return;
    }
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }
    if (!trimmedPassword) {
      setError("Password is required.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        window.localStorage.setItem("shelfly-signup-pending", "true");

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            data: {
              full_name: trimmedFullName,
            },
          },
        });
        if (signUpError) {
          window.localStorage.removeItem("shelfly-signup-pending");
          setError(getAuthErrorMessage(signUpError));
        } else {
          // Keep account creation separate from signing in, even when Supabase
          // is configured to return a session immediately after signup.
          if (signUpData.session) {
            await supabase.auth.signOut();
          }
          setMode("signin");
          setPassword("");
          setSuccessMessage(
            "Account created. Please sign in to open your reading shelf."
          );

          window.localStorage.removeItem("shelfly-signup-pending");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signInError) {
          setError(getAuthErrorMessage(signInError));
        }
        // On success, the onAuthStateChange listener in AuthProvider will
        // automatically swap to the dashboard — no redirect needed.
      }
    } catch (err) {
      window.localStorage.removeItem("shelfly-signup-pending");
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(getAuthErrorMessage({ message, status: 500 }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-paper flex flex-col items-center justify-center px-4 py-12">
      {/* Decorative top element */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-dew-drop border-2 border-charcoal/20 flex items-center justify-center rotate-3 shadow-xs">
          <BookOpen className="w-9 h-9 text-charcoal/70" />
        </div>
        <span className="absolute -top-2 -right-3 text-2xl rotate-12 select-none">
          ✨
        </span>
      </div>

      {/* Heading */}
      <h1 className="font-serif-literary text-4xl sm:text-5xl font-bold text-cocoa-ink lowercase tracking-tight">
        shelfly.
      </h1>
      <p className="font-sans text-sm sm:text-base text-charcoal/70 mt-2 mb-8 text-center max-w-sm">
        {mode === "signin"
          ? "welcome back to your reading sanctuary."
          : "create your personal reading shelf."}
      </p>

      {/* Auth Card */}
      <div className="w-full max-w-sm bg-cream-paper border border-charcoal/15 rounded-[12px] shadow-lg p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-name"
                className="text-xs font-sans font-medium text-charcoal/60 uppercase tracking-wider"
              >
                name
              </label>
              <input
                id="auth-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="your name"
                autoComplete="name"
                className="w-full px-4 py-2.5 rounded-[8px] border border-charcoal/20 bg-cream-paper text-charcoal placeholder:text-charcoal/40 text-sm focus:outline-none focus:border-charcoal focus:ring-2 focus:ring-charcoal/10 transition-all"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-email"
              className="text-xs font-sans font-medium text-charcoal/60 uppercase tracking-wider"
            >
              email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-charcoal/20 bg-cream-paper text-charcoal placeholder:text-charcoal/40 text-sm focus:outline-none focus:border-charcoal focus:ring-2 focus:ring-charcoal/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-password"
              className="text-xs font-sans font-medium text-charcoal/60 uppercase tracking-wider"
            >
              password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "at least 6 characters" : "your password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full pl-10 pr-10 py-2.5 rounded-[8px] border border-charcoal/20 bg-cream-paper text-charcoal placeholder:text-charcoal/40 text-sm focus:outline-none focus:border-charcoal focus:ring-2 focus:ring-charcoal/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2 font-sans">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-[#1e7e34] bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-[8px] px-3 py-2 font-sans">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "pill-button w-full justify-center mt-2",
              loading && "opacity-60 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === "signin" ? "signing in..." : "creating account..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{mode === "signin" ? "sign in" : "create account"}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-sm font-sans text-charcoal/60">
          {mode === "signin" ? (
            <>
              no account yet?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-marker-orange hover:text-burnt-sienna underline underline-offset-2 transition-colors cursor-pointer"
              >
                create one
              </button>
            </>
          ) : (
            <>
              already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-marker-orange hover:text-burnt-sienna underline underline-offset-2 transition-colors cursor-pointer"
              >
                sign in
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer whisper */}
      <p className="mt-8 text-xs font-sans text-charcoal/40 text-center">
        your shelf, your sanctuary.
      </p>
    </div>
  );
}