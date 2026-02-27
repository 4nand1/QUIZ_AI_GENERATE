"use client";
import { Button } from "@/components/ui/button";
import { Appsidebar } from "./_components/layout/AppSidebar";
import { FileText, Sidebar, Sparkles } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen w-screen flex bg-[#F5F5F5]">
      <div
        className={`h-screen bg-white border-r transition-all duration-300 ${
          open ? "w-70" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {open && <p className="font-semibold">History</p>}

          <Button
            className="bg-white text-black"
            onClick={() => setOpen(!open)}
          >
            <Sidebar className="h-6 w-6" />
          </Button>
        </div>

        {open && (
          <div className="flex flex-col gap-2 px-4">
            <p>Genghis Khan</p>
            
          </div>
        )}
      </div>
      <div className="h-full w-full flex justify-center mt-15">
        <div
          className={`bg-white border h-110 rounded-lg flex flex-col p-5 gap-3 ${
            open ? "w-180" : "w-210"
          }`}
        >
          <div className="flex gap-1">
            <Sparkles />
            <p>Article Quiz Generator</p>
          </div>
          <p>
            Paste your article below to generate a summarize and quiz question.
            Your articles will saved in the sidebar for future reference
          </p>
          <div className="flex">
            <FileText />
            <p>Artice Title</p>
          </div>
          <Input placeholder="Enter a title for your article..." />
          <div className="flex">
            <FileText />
            <p>Artice Content</p>
          </div>
          <Input
            placeholder="Paste your article content here..."
            className="h-35"
          />
          <div className="flex justify-end">
            <Button className="opacity-20">Generate summary</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
