"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Brain, FileText, History, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: FileText,
    title: "Paste any study material",
    description: "Turn notes, lessons, or article text into a structured quiz flow.",
  },
  {
    icon: Sparkles,
    title: "Generate in one step",
    description: "Create a summary and five ready-to-answer questions in a single action.",
  },
  {
    icon: History,
    title: "Keep quiz history",
    description: "Every generated quiz stays available in your account sidebar for review.",
  },
];

export const SignedOutLanding = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(243,244,246,0.82)_38%,_rgba(221,241,241,0.72)_100%)] text-slate-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Quiz Generate
              </p>
              <p className="text-sm text-slate-600">
                Study notes into polished quizzes
              </p>
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="rounded-full border border-slate-300/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white">
              Sign In
            </button>
          </SignInButton>
        </header>

        <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-500" />
              AI quiz workflow for classes, lessons, and revision
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
              Build clean, fast quizzes from your own content.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Sign in to generate summaries, answerable multiple-choice questions,
              and a reusable quiz history that stays attached to your account.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <SignUpButton mode="modal">
                <button className="rounded-full bg-slate-950 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
                  Create Free Account
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="rounded-full border border-slate-300 bg-white/85 px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white">
                  I Already Have an Account
                </button>
              </SignInButton>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-6 h-56 rounded-full bg-teal-300/30 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.45)] backdrop-blur sm:p-7">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Workflow
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">From notes to quiz</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                    Ready in minutes
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Add a title and paste your study content.",
                    "Generate a concise summary plus five questions.",
                    "Review results and reopen past quizzes from history.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-300 text-sm font-bold text-slate-950">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      History Preview
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      Your recent quizzes stay accessible after each generation.
                    </p>
                  </div>
                  <History className="h-5 w-5 text-teal-700" />
                </div>

                <div className="space-y-3">
                  {["Cell Biology Review", "World History Notes", "Intro to Algebra"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {5 + index} question set saved to history
                            </p>
                          </div>
                          <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                            Stored
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
