"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export const SignedOutLanding = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Quiz Generate</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in or create an account to use the app.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <SignInButton mode="modal">
            <button className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Log In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Sign Up
            </button>
          </SignUpButton>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-slate-900">What you can do:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Paste your study notes or article text.</li>
            <li>Generate a summary and quiz automatically.</li>
            <li>Open saved quizzes later from your history.</li>
          </ul>
        </div>
      </div>
    </main>
  );
};
