import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import "@/styles/globals.css";

import { PropsWithChildren } from "react";
import { AppSidebar, Header, SignedOutLanding } from "./_components";

const clerkAppearance = {
  layout: {
    logoPlacement: "none",
  },
  variables: {
    colorPrimary: "#0f172a",
    colorText: "#0f172a",
    colorTextSecondary: "#475569",
    colorBackground: "#f8fafc",
    colorInputBackground: "#ffffff",
    colorInputText: "#0f172a",
    colorDanger: "#dc2626",
    borderRadius: "1rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    modalBackdrop: "bg-slate-950/45 backdrop-blur-sm",
    modalContent:
      "border border-white/70 bg-transparent shadow-none",
    card:
      "border border-white/70 bg-white/90 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl",
    cardBox: "shadow-none",
    headerTitle: "text-slate-950 text-2xl font-semibold tracking-tight",
    headerSubtitle: "text-slate-500",
    socialButtonsBlockButton:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
    socialButtonsBlockButtonText: "font-medium text-slate-700",
    dividerLine: "bg-slate-200",
    dividerText: "text-slate-400",
    formFieldLabel: "text-slate-700 font-medium",
    formFieldInput:
      "h-11 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:border-slate-400 focus:ring-0",
    formButtonPrimary:
      "h-11 rounded-full bg-slate-950 font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800",
    footerActionLink:
      "font-semibold text-teal-700 hover:text-teal-800",
    identityPreviewText: "text-slate-700",
    identityPreviewEditButton:
      "font-medium text-teal-700 hover:text-teal-800",
    otpCodeFieldInput:
      "h-11 w-11 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm",
    formResendCodeLink: "font-semibold text-teal-700 hover:text-teal-800",
  },
} as const;

export const metadata: Metadata = {
  title: "Quiz Generate",
  description: "Generate quizzes and summaries from your study content.",
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body className="antialiased">
          <SignedOut>
            <SignedOutLanding />
          </SignedOut>

          <SignedIn>
            <div className="w-screen h-screen">
              <Header />

              <AppSidebar>{children}</AppSidebar>
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
