"use client";

import dynamic from "next/dynamic";

const TerminalClient = dynamic(() => import("@/components/terminal/TerminalClient"), {
  ssr: false, // ✅ disable SSR for browser-only library
});

export default function TerminalPage() {
  return (
    <html>
        <body>
            <div className="h-screen bg-gray-50 p-4">
                <TerminalClient /> 
            </div>
        </body>
    </html>
  );
}