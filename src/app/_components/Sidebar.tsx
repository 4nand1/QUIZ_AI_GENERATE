"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Sparkles } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  questions: { id: string }[];
}

export const AppSidebar = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (quizzes.length === 0) {
          setLoading(true);
        }

        setError(null);

        const response = await fetch("/api/all", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz history");
        }

        const data: Quiz[] = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [pathname]);

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      <Sidebar
        className="border-r border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(247,250,252,0.98)_100%)] pt-14"
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-slate-200/80 px-3 py-4">
          <div className="flex items-center justify-between gap-3">
            {isOpen && (
              <div>
                <div className="flex items-center gap-2 text-slate-900">
                  <History className="h-4 w-4 text-teal-700" />
                  <h1 className="text-lg font-semibold">History</h1>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Your saved quizzes appear here automatically.
                </p>
              </div>
            )}
            <SidebarTrigger className="border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="space-y-3 px-3 py-4">
            {isOpen && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Auto-saved history
                </div>
                <p className="mt-2 text-xs leading-5 text-amber-800/90">
                  Every new quiz is stored after generation and refreshed when
                  you move between pages.
                </p>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs leading-5 text-red-700">{error}</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-5 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No quizzes yet
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Generate your first quiz and it will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/${quiz.id}`}
                    className={`block rounded-2xl border p-3.5 shadow-sm transition ${
                      pathname.startsWith(`/${quiz.id}`)
                        ? "border-teal-300 bg-teal-50/90 shadow-teal-100"
                        : "border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {quiz.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {quiz.questions.length}Q
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-3">
                      {quiz.summary}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Saved quiz</span>
                      <span>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </SidebarContent>
      </Sidebar>

      <div className="h-screen w-full bg-[linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,0.86)_100%)] flex justify-center items-center">
        {children}
      </div>
    </SidebarProvider>
  );
};
