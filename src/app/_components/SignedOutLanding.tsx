"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export const SignedOutLanding = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Quiz Generate</h1>
        <p className="mt-2 text-sm text-slate-600">
          Continue to your account to create and save quizzes.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <SignUpButton mode="modal">
            <button className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Sign Up
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Log In
            </button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
};
